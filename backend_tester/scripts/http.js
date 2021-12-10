const API_PATH = "https://tabletopapp.herokuapp.com/api";

// POSTs a new character into the database
/* export */ async function createCharacter(charData)
{
    let options = new Object();
    options.method = "POST"; // set request method
    options.headers = { 'Content-Type': 'application/json' }; // set request headers
    options.body = JSON.stringify(charData); // set data to send
    //console.log(options.body)
    const response = await fetch(`${API_PATH}/newChar`, options);
    //  console.log(response);
    let json = await response.json();
    console.log(json);
    return json;
}

// POSTs a new story into the database
/*export*/ async function createStory(storyData) 
{
    let options = new Object();
    options.method = "POST"; // set request method
    options.headers = { 'Content-Type': 'application/json' }; // set request headers
    options.body = JSON.stringify(storyData); // set data to send
    //console.log(options.body)
    const response = await fetch(`${API_PATH}/newStory`, options);
    //console.log(response);
    let json = await response.json();
    console.log(json);
    return json;
}

// GETs an existing character from the database
/*export*/ async function loadCharacter(charID) 
{
    const options = new Object(); // new request object
    options.method = "GET"; // set request method
    const response = await fetch(`${API_PATH}/getChar/${charID}`, options); // await response
    const json = await response.json(); // extract data from response
    console.log(json);
    return json; // return it
}

// GETs an existing story from the database
/*export*/ async function loadStory(storyID) 
{
    const options = new Object(); // new request object 
    options.method = "GET"; // set request method
    const response = await fetch(`${API_PATH}/getStory/${storyID}`, options); // await response
    const json = await response.json(); // extract data from response
    console.log(json);
    return json; // return it
}

// PUTs new character data into the database
/*export*/ async function updateCharacter(data) 
{
    const options = new Object(); // new request object
    options.method = "POST"; // set request method
    options.headers = { 'Content-Type': 'application/json' }; // set request headers
    data.u_type = "char" // set type of data to "char" to update a character
    options.body = JSON.stringify(data) // set data to send
    const response = await fetch(`${API_PATH}/update`, options);
    let json = await response.json();
    console.log(`Updating character ${data.name}`)
    console.log(json);
    return json
}

// PUTs new story data into the database
/*export*/ async function updateStory(data) 
{
    const options = new Object(); // new request object
    options.method = "POST"; // set request method
    options.headers = { 'Content-Type': 'application/json' }; // set request headers
    data.u_type = "story" ; // set type of data to "story" to update a story
    //console.log(data)
    options.body = JSON.stringify(data); // set data to send
    const response = await fetch(`${API_PATH}/update`, options); // await response
    let json = await response.json(); // extract json
    console.log(json);
    return json
}

/*export*/ async function createUser(user) 
{
    const options = new Object(); // new request object
    options.method = "POST"; // set request method
    options.headers = { 'Content-Type': 'application/json' }; // set request headers
    options.body = JSON.stringify(user); // set data to send
    const response = await fetch(`${API_PATH}/signup`, options);
    const json = await response.json();
    console.log(json)
    return json;
}

/*export*/ async function signIntoUser(name, pass) 
{
    const options = {}; // new request object
    options.method = "POST"; // set request method
    options.headers = { 'Content-Type': 'application/json' }; // set request headers
    options.body = JSON.stringify({ "name": name, "pass": pass }); // set data to send
    const response = await fetch(`${API_PATH}/login`, options);
    const json = await response.json();
    console.log(json);
    return json;
}

