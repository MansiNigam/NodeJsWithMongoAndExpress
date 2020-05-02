var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user')
var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//signup of the user
router.post('/signup', function (req, res, next) {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {
        var err = new Error('User '+ req.body.username + ' already exist');
        err.status = 403;
        next(err);
      }
      else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        });
      }
    })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: ' Registration Successful !', user: user });
    }, (err) => next(err))
    .catch((err) => next(err));
});

//To track the user by expree
router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    var authHeaders = req.headers.authorization;
    if (!authHeaders) {
      var err = new Error('You are not authenticated...');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err); // error msg from here will sent back to client
    }
    var auth = new Buffer.from(authHeaders.split(' ')[1], 'base64')   // here the string will br considered in as an array
      .toString().split(':');
    var username = auth[0];
    var password = auth[1];

    User.findOne({ username: username })
      .then((user) => {
        if (user == null) {
          var err = new Error('User ', username, 'dose not exist..!');
          err.status = 403;
          return next(err);
        }
        else if (user.password != password) {
          var err = new Error('Your password is incorrect... ');
          err.status = 403;
          return next(err);
        }
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader = ('Content-Type', 'text/plain');
          res.end('You are authenticated!');
        }
        // if(username === 'admin' && password === 'password'){
        //   //res.cookie('user', 'admin', {signed :true});
        //   req.session.user ='admin';
        //   next(); // from auth the req will pass to next middleware layer thn express will handle the further process
        // } 
        // else {
        //   var err = new Error('You are not authenticated...');

        //   res.setHeader('WWW-Authenticate', 'Basic');
        //   err.status = 401;
        //   return next(err);
        // }
      }).catch((err)=> next(err));

  }
  else{
    res.statusCode =200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
});

//logout....
router.get('/logout', (req,res,next)=> {
  if(req.session){
    //the details will be removed from the server side
    req.session.destroy();
    //asking the client to remove the cookie
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Errpr(' You are not logged in..')
    err.status =  403;
next(err);
  }
});

module.exports = router;
