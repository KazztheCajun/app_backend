const express = require('express');
const router = express.Router();
const USERS = require("../models/users");
const shortid = require('shortid');
const MongoClient = require('mongodb').MongoClient;
const mongo = new MongoClient(process.env.API_KEY,{ useNewUrlParser: true, useUnifiedTopology: true });
const passport = require('../middlewares/passport-config');

mongo.connect( async (err) => // all calls to the mongo database have to be made within the connect block
{
    if (err)
    {
        return console.error(err);
    }

    const op = {dateStyle: 'short', timeStyle: 'short' };
    const getTime = new Intl.DateTimeFormat('en-US', op).format; // function to formate date and time information easily

    const savedUsers = mongo.db("TabletopApp").collection("Users"); // save the users collection connection for later use
    const savedChars = mongo.db("TabletopApp").collection("Characters"); // save the characters collection connection for later use
    const savedStories = mongo.db("TabletopApp").collection("Stories"); // save the stories collection connection for later use

    console.log(`[Server -- ${getTime(new Date())}] Connected to Tabletop App Database`);

    //Server Setup
    
    async function updateServer() // check the database for current list of tracked users
    {
        let saved = await savedUsers.find({}).toArray();
        //console.log(saved);
        USERS.setUsers(saved);
        //console.log(USERS.users);
        console.log(`[Server -- ${getTime(new Date())}] Loading saved users`);
    }
    updateServer();
    
    // Requests the character with the given ID
    // Returns all the data associated with that character object
    router.get("/getChar/:id", async(request, response) =>
    {
        // frontend will send ID in request body
        const id = request.params.id;
        console.log(`[Server -- ${getTime(new Date())}] Fetching character ${id}`);
        const res = await savedChars.findOne({_id: id});
        //console.log(res);
        if (typeof res != undefined)
        {
            response.json({"success": true, "message": `Character ${res.name} was succesfully retrieved from database`, "data": res});
        }
        else
        {
            response.json({"success": false, "message": `Unable to find a character ${id} in database.`, "data": res});
        }
    });

    // Requests the story with the given ID
    // Returns all the data associated with that character object
    router.get("/getStory/:id", async(request, response) =>
    {
        // frontend will send ID in request body
        const id = request.params.id;
        console.log(`[Server -- ${getTime(new Date())}] Fetching story ${id}`);
        const res = await savedStories.findOne({_id: id});
        //console.log(res);
        if (typeof res != undefined)
        {
            response.json({"success": true, "message": `Story ${res.title} was succesfully retrieved from database`, "data": res});
        }
        else
        {
            response.json({"success": false, "message": `Unable to find a story ${id} in database.`, "data": res});
        }
    });
    
    // Creates a new character from the given info and stores it in the db
    // Returns the created character for frontend use
    router.post("/newChar", async(request, response) =>
    {
        
        let char = request.body // frontend will send character info in body
        char._id = shortid.generate() // add ID to object
        console.log(`[Server -- ${getTime(new Date())}] Creating new character ${char._id} - ${char.name}`)
        const res = await savedChars.insertOne(char) // send to database
        if(res.acknowledged)
        {
            response.json({"success": true, "message": `Character ${char.name} was succesfully saved`, "data": char});
        }
        else
        {
            response.json({"success": false, "message": `Unable to create character ${char.name}`, 'data': res});
        }
    });

    // Creates a new story from the given info and stores it in the db
    // Returns the created story for frontend use
    router.post("/newStory", async(request, response) =>
    {
        
        let story = request.body // frontend will send story info in body
        story._id = shortid.generate() // add ID to object
        console.log(`[Server -- ${getTime(new Date())}] Creating new story ${story._id} - ${story.title}`)
        const res = await savedStories.insertOne(story) // send to database
        //console.log(res)
        if(res.acknowledged)
        {
            //updateServer();
            response.json({"success": true, "message": `Story ${story.title} was succesfully saved`, "data": story});
        }
        else
        {
            response.json({"success": false, "message": `Unable to create story ${story.title}`, "data": res});
        }
    });

    // updates either a story or a character in the database with new info
    router.post("/update", async(request, response) =>
    {
        const b = request.body; // get the data from the request body
        let res;
        //console.log(b);
        switch (b.u_type) { // switch based on if updating a char or a story
            case 'char':
                res = await savedChars.updateOne({_id: b.data._id}, {$set: {name: b.data.name, class: b.data.class, stats: b.data.stats, background: b.data.background, notes: b.data.notes, image: b.data.image}}); // update the data in the database
                console.log(`[Server -- ${getTime(new Date())}] Updating ${b.data._id} - ${b.data.name}`)
                if(res.modifiedCount == 1 || res.matchedCount == 1)
                {
                    
                    response.json({"success": true, "message": `Character ${b.data.name} was updated succesfully`, "data": res});
                }
                else
                {
                    response.json({"success": false, "message": `Unable to update character ${b.data._id}`, "data": res});
                }
                break;
            case 'story':
                res = await savedStories.updateOne({_id: b.data._id}, {$set: {title: b.data.title, objects: b.data.objects, notes: b.data.notes, image: b.data.image}}); // update the data in the database
                console.log(`[Server -- ${getTime(new Date())}] Updating ${b.data._id} - ${b.data.title}`)
                if(res.modifiedCount == 1 || res.matchedCount == 1)
                {
                    response.json({"success": true, "message": `Story ${b.data.title} was updated succesfully`, "data": res});
                }
                else
                {
                    response.json({"success": false, "message": `Unable to update story ${b.data._id}`, "data": res});
                }
                break;
        }
        
    });

    // create a new user, save it to the database, and update the server
    router.post("/signup", async(request, response) =>
    {
        const user = request.body;
        let u = await USERS.add(user);
        let res = await savedUsers.insertOne(u);
        if(res.acknowledged)
        {
            updateServer(); // update the server to reflect any potential changes
            console.log(`[Server -- ${getTime(new Date())}] ${u.name} has been created`)
            response.json({"success": true, "message": `${u.name} was sucessfully created`, "data": u});
        }
        else
        {
            response.json({"success": false, "message": `Unable to update story ${b._id}`, "data": res});
        }
        
        
    });

    router.post("/login", passport.authenticate('local'), (request, response) =>
    {
        console.log(`[Server -- ${getTime(new Date())}] login request recieved for ${request.user.name}`);
        //  console.log(request.body);
        //  console.log(request.user);
        response.json({"success": true, "message": `${request.user.name} has logged in!`, "data": request.user});
        
    });

     
    /*
    router.get("/user/:id", async(request, response) =>
    {
        const id = request.params.id;
        let u = await savedUsers.findOne({_id: id}, {password: 0});
    //    console.log(u);
        let json = response.json({"user": u, "success": true, "message": "User was found!"});
        return json;
    }); 
    */
    
});




module.exports = router;