const shortid = require('shortid');
const bcrypt = require('bcrypt');

class Users
{
    constructor()
    {
        this.users = [];
    }

    async add(user)
    {
        user._id = shortid.generate(); // create id for user
        let temp = await bcrypt.hash(user.pass, 10); // encrypt password
        user.pass = temp
        //console.log(user);
        this.users.push(user); // add to server user list
        return user;
    }

    findUser(key, value)
    {
        const user = this.users.find(item => item[key] == value)
        return user;
    }
    
    setUsers(list)
    {
        this.users = list;
    }
}

module.exports = new Users();