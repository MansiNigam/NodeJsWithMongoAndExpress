var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user')
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  User.find({})
  .then((users) => {
    res.statusCode =200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
});

//signup of the user
router.post('/signup', function (req, res, next) {
  User.register(new User({username: req.body.username}),
  req.body.password,
   (err,user)=> {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
      }
      else {
        if(req.body.firstname)
        user.firstname = req.body.firstname;
        if(req.body.lastname)
        user.lastname = req.body.lastname;
        user.save((err, user) =>{
          if(err){
            res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
      return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true , status: ' Registration Successful !' });
        });
        });
      }
    });
});

//To track the user by expree
router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true , token: token,  status: ' You are successfully loged in ! !' });
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
