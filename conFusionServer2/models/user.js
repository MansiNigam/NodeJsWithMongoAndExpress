//File to create user schema and the model.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: { 
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', user);
