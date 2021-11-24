const express = require('express');
const router = express.Router();
const USERS = require("../models/users");
const shortid = require('shortid');
const MongoClient = require('mongodb').MongoClient;
const MongoURL = process.env.API_KEY
const mongo = new MongoClient("mongodb+srv://server_access:Q6VNkbapCDu5Gikd@gygax.bubui.mongodb.net/TabletopApp?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true });
const passport = require('../middlewares/passport-config');

mongo.connect( async (err) => // all calls to the mongo database have to be made within the connect block
{
    if (err)
    {
        return console.error(err);
    }
    console.log("[Server] Connected to Tabletop App Database successfully.");

    const savedUsers = mongo.db("TabletopApp").collection("Users"); // save the users collection connection for later use
    const savedChars = mongo.db("TabletopApp").collection("Characters"); // save the characters collection connection for later use
    const savedStories = mongo.db("TabletopApp").collection("Stories"); // save the stories collection connection for later use

    console.log("[Server] Loading saved users");
    
    //Server Setup
    
    async function updateServer() // check the database for current list of tracked users
    {
        let saved = await savedUsers.find({}).toArray();
        //console.log(saved);
        USERS.setUsers(saved);
        //console.log(USERS.users);
    }
    updateServer();
    
    // Requests the character with the given ID
    // Returns all the data associated with that character object
    router.get("/getChar", async(request, response) =>
    {
        // frontend will send ID in request body
        const id = request.body.id;
    //    console.log(id);
        const data = await savedChars.findOne({_id: id});
    //    console.log(data);
        if (typeof data != 'undefined')
        {
            response.json(data);
        }
        else
        {
            response.json({"success": false, "message": "No character with that ID exists."});
        }
    });

    // Requests the story with the given ID
    // Returns all the data associated with that character object
    router.get("/getStory", async(request, response) =>
    {
        // frontend will send ID in request body
        const id = request.body.id;
    //    console.log(id);
        const data = await savedStories.findOne({_id: id});
    //    console.log(data);
        if (typeof data != 'undefined')
        {
            response.json(data);
        }
        else
        {
            response.json({"success": false, "message": "No story with that ID exists."});
        }
    });
    
    // Creates a new character from the given info and stores it in the db
    // Returns the created character for frontend use
    router.post("/newChar", async(request, response) =>
    {
        // frontend will send character info in body
        const b = request.body;
        // console.log(name);
        const char = {...b, _id: shortid.generate()};
        const res = await savedChars.insertOne(char);
        if(res.acknowledged)
        {
            updateServer();
            response.json({"success": true, "message": `Character ${res.insertedId} was succesfully saved`, "data": char});
        }
        else
        {
            response.json({"success": false, "message": `Unable to create character ${b._id}`, 'data': res});
        }
    });

    // Creates a new story from the given info and stores it in the db
    // Returns the created story for frontend use
    router.post("/newStory", async(request, response) =>
    {
        // frontend will send character info in body
        const b = request.body;
        // console.log(name);
        const story = {...b, _id: shortid.generate()};
        const res = await savedStories.insertOne(story);
        if(res.acknowledged)
        {
            updateServer();
            response.json({"success": true, "message": `Story ${res.insertedId} was succesfully saved`, "data": story});
        }
        else
        {
            response.json({"success": false, "message": `Unable to create story ${b._id}`, "data": res});
        }
    });

    // updates either a story or a character in the database with new info
    router.post("/update", async(request, response) =>
    {
        const b = request.body; // get the data from the request body
        let res = 0;
        //console.log(home);
        switch (b.type) { // switch based on if updating a char or a story
            case 'char':
                res = await savedChars.updateOne({_id: b._id}, {$set: {name: b.name, class: b.class, stats: b.stats, background: b.background, notes: b.notes, image: b.image}}); // update the data in the database
                if(res.acknowledged)
                {
                    updateServer(); // update the server to reflect any potential changes
                    response.json({"success": true, "message": `Character ${res.insertedId} was updated succesfully`, "data": res});
                }
                else
                {
                    response.json({"success": false, "message": `Unable to update character ${b._id}`, "data": res});
                }
                break;
            case 'story':
                let res = await savedStories.updateOne({_id: b._id}, {$set: {title: b.title, objects: b.objects, notes: b.notes, image: b.image}}); // update the data in the database
                if(res.acknowledged)
                {
                    updateServer(); // update the server to reflect any potential changes
                    response.json({"success": true, "message": `Story ${res.insertedId} was updated succesfully`, "data": res});
                }
                else
                {
                    response.json({"success": false, "message": `Unable to update story ${b._id}`, "data": res});
                }
                break;
        }
        
    });

/*    router.post("/login", async(request, response, next) =>
    {
    //  console.log("login request recieved");
    //  console.log(request.body);
        const config = {};
        const handler = passport.authenticate('local');
        handler(request, response, (req, res) =>
        {
        //    console.log(request.user);
            response.json({"user": request.user, "success": true, "message": "User has logged in!"});
        });
    });

    router.post("/signup", async(request, response) =>
    {
        const {name, pass, homes} = request.body;
        let u = await USERS.add(name, pass, homes);
        savedUsers.insertOne(u);
        response.json({"success": true, "message": `${name} was sucessfully created`});
    }); 

    router.get("/user/:id", async(request, response) =>
    {
        const id = request.params.id;
        let u = await savedUsers.findOne({_id: id}, {password: 0});
    //    console.log(u);
        let json = response.json({"user": u, "success": true, "message": "User was found!"});
        return json;
    }); */
    
    //mongo.close();
});




module.exports = router;