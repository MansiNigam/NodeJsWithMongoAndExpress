//File to create user schema and the model.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//passport - Adding passport based authentication
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({  
    admin: { 
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
