const bcrypt = require('bcryptjs');
const usersCollection = require('../db').db().collection('users');
const validator = require('validator');

let User = function(data) {
    this.data = data;
    this.errors = [];
}

User.prototype.cleanUp = function() {
    if(typeof(this.data.username) !== "string"){ this.data.username = ""}
    if(typeof(this.data.email) !== "string"){ this.data.email = ""}
    if(typeof(this.data.password) !== "string"){ this.data.password = ""}

    //Remove additional properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function() {
    if(this.data.username == "") { this.errors.push(`You must provide a username.`) }
    if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) { this.errors.push(`Username can only contain letters and numbers.`)}
    if(this.data.username.length > 0 && this.data.username.length < 3) { this.errors.push(`Username should be atleast 3 characters.`)}
    if(this.data.username > 30) { this.errors.push(`Username cannot exceed 30 characters.`)}
    
    if(!validator.isEmail(this.data.email)) { this.errors.push(`You must provide a valid email address.`) }
    
    if(this.data.password == "") { this.errors.push(`You must provide a password.`) }
    if(this.data.password.length > 0 && this.data.password.length < 12) { this.errors.push(`Password should be atleast 12 characters.`)}
    if(this.data.password > 50) { this.errors.push(`Password cannot exceed 50 characters.`)}
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)){
                resolve(`Congrats!!`);
            } else {
                reject(`Invalid username/password.`);
            }
        }).catch((e) => {
            reject(`Please try again later.`);
        });
    })
}

User.prototype.register = function(){
    //Step 1: Validate user data
    this.cleanUp();
    this.validate();

    //Step 2: Save user data in database if validated
    if(!this.errors.length){
        //hash user password
        let salt = bcrypt.genSaltSync(10);
        this.data.password = bcrypt.hashSync(this.data.password, salt);
        usersCollection.insertOne(this.data);
    }
}

module.exports = User;