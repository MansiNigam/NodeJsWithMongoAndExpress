var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
//it will have extract from the incomimg request

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//this will e required for the support for sessions