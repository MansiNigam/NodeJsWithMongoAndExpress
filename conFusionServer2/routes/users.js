var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user')
var router = express.Router();
var passport = require('passport');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//signup of the user
router.post('/signup', function (req, res, next) {
  User.register(new User({username: req.body.username}),req.body.password, (err,user)=> {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true , status: ' Registration Successful !' });
        });
      }
    });
});

//To track the user by expree
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true , status: ' You are successfully loged in ! !' });
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
