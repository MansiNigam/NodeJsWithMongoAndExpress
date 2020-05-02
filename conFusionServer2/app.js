var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
//create a new file session in proj, has tracking data.

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to server...');
}, (err) => {
  console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

//cookieParser with secret key / SIGNED COOKIES
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next){
  console.log(req.headers);
  console.log(req.signedCookies);
console.log('session')
  console.log(req.session.user)
  // if(!req.signedCookies.user){
    if(!req.session.user){
    //var authHeaders = req.headers.authorization;
   // if(!authHeaders){
      console.log('1')
      var err = new Error('You are not authenticated...');
      res.setHeader('WWW-Authenticate' , 'Basic');
      err.status = 403;
      return next(err); // error msg from here will sent back to client
   // }
    // console.log('2')
    // var auth = new Buffer.from(authHeaders.split(' ')[1],'base64')   // here the string will br considered in as an array
    // .toString().split(':'); 
    // var username = auth[0];
    // var password = auth[1];
  
    // if(username === 'admin' && password === 'password'){
    //   //res.cookie('user', 'admin', {signed :true});
    //   req.session.user ='admin';
    //   next(); // from auth the req will pass to next middleware layer thn express will handle the further process
    // } else {
    //   console.log('4')
    //   var err = new Error('You are not authenticated...');
  
    //   res.setHeader('WWW-Authenticate' , 'Basic');
    //   err.status = 401;
    //   return next(err);
    // }
  } else { 
    console.log('5')
    if(req.session.user === 'authenticated'){
     // if(req.signedCookies.user === 'admin'){
       console.log('req-session' , req.session)
      next();
    } else {
      var err = new Error('You are not authenticated...');
  
      err.status = 403;
      return next(err);
    } 
  }
  
};

app.use(auth);

app.use(express.static(path.join(__dirname, 'public'))); // enable us to use static data from the public folder


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
