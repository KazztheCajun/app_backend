const API_PATH = "https://obscure-hollows-34262.herokuapp.com/api";

// POSTs a new home into the DB
export const createHomeDB = async (homeName) =>
{
    const options = new Object();
    options.method = "POST";
    const response = await fetch(API_PATH + `/new?name=${homeName}`, options);
//    console.log(response);
    let json = await response.json();
    console.log(json);
    return json;
}

// GETs an existing home from the DB
export const loadHomeDB = async (homeID) =>
{
    const options = new Object();
    options.method = "GET";
    const response = await fetch(API_PATH + `/home/${homeID}`, options);
    const data = await response.json();
   // console.log(data);
    return data;
}

// PUTs new information into a home
export const updateHomeDB = async (update) =>
{
    const options = new Object();
    options.method = "POST";
    options.headers = {'Content-Type': 'application/json'};
    options.body = JSON.stringify(update);
    const response = await fetch(`${API_PATH}/update/home`, options);
    let json = await response.json();
    // console.log(json);
    if (!response.ok)
    {
        alert(`[HTTP] Error updating home ${update}: ${json.message}`);
    }
    
}

export const loadHouseList = async (list) =>
{
    const options = new Object();
    options.method = "POST";
    options.headers = {'Content-Type': 'application/json'};
    options.body = JSON.stringify(list);
    const response = await fetch(API_PATH + `/list/homes`, options);
    // console.log(response);
    const data = await response.json();
    // console.log(data);
    return data;
}

export const saveUserToDB = async (user) =>
{
    const options = new Object();
    options.method = "POST";
    options.headers = {'Content-Type': 'application/json'};
    options.body = JSON.stringify(user);
    const response = await fetch(API_PATH + '/signup', options);
    let json = await response.json();
    if (!json.success)
    {
        alert(`[HTTP] Error creating ${user.user}: ${json.message}`);
    }
    return json;
}

export const signIntoUser = async (name, pass) =>
{
    const options = {};
    options.method = "POST";
    options.headers = {'Content-Type': 'application/json'};
    options.body = JSON.stringify({"name": name, "pass": pass});
    const response = await fetch(API_PATH + `/login`, options);
    const json = await response.json();
    console.log(json);
    if (!json.success)
    {
        alert(`[HTTP] Error signing into ${name}`);
    }
    return json;
}

export const loadUserFromDB = async (id) =>
{
    const options = new Object();
    options.method = "GET";
    const response = await fetch(API_PATH + `/user/${id}`, options);
    let json = await response.json();
    if (!json.success)
    {
        alert(`[HTTP] ${json.message}`);
    }
    return json;

}

export const updateUserInDB = async (user) =>
{
    const options = new Object();
    options.method = "POST";
    options.headers = {'Content-Type': 'application/json'};
    console.log(user);
    options.body = JSON.stringify(user);
    const response = await fetch(API_PATH + '/update/user', options);
    if (!response.ok)
    {
        alert(`[HTTP] Error updating user ${update}: ${json.message}`);
    }
}