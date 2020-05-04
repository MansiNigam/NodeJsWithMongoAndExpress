//with authenticate.verifyUser, only verified users can be able to perform operations

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
dishRouter.route('/')
.get((req,res,next)=>{
    Dishes.find({}).then((dishes)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json'); 
        res.json(dishes)
    }, (err) => next(err)
   // res.end('We will sent you all the dishes!');
).catch((err)=> next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    Dishes.create(req.body).then((dish)=> {
        console.log('Dish created...', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err)
    )
    .catch((err)=> next(err))
//    res.end('Will add the dish: '+ req.body.name + ' with details '+ req.body.description)
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported in dishes!');
})

.delete(authenticate.verifyUser, (req,res,next)=> {
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err)
    ).catch((err) => next(err))    
    //res.end('Deleting all dishes!!');
});

dishRouter.route('/:dishId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })

 .get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err)).catch((err)=> next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode= 403;
    res.end('Post operation is not supported on /dishes/'+ req.params.dishId)
})

.put(authenticate.verifyUser, (req,res,next)=> {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true})
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err)).catch((err)=> next(err));
    // res.write('Updating the dish:'+ req.params.dishId + '/n');
    // res.end('Will update the dish: '+ req.body.name +' with details: '+ req.body.description)
})

.delete(authenticate.verifyUser, (req,res,next)=> {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=> next(err))
    .catch((err)=> next(err));
    //res.end('Deleting dish : '+ req.params.dishId);
});

dishRouter.route('/:dishId/comments')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=> {
        if(dish != null){
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json'); 
            res.json(dish.comments)
        }
      else{
          err = new Error('Dish' , req.params.dishId + 'not found..!!');
          err.statusCode = 404;
          return next(err); // this will be handled in the app.js file in error handler
      }
    }, (err) => next(err)
).catch((err)=> next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId).then((dish)=> {
        if(dish != null){
            console.log('Dish created...', dish);        
            dish.comments.push(req.body);
            dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }  
        else{
            err = new Error('Dish' , req.params.dishId + 'not found..!!');
            err.statusCode = 404;
            return next(err); 
        }     
    }, (err) => next(err)
    )
    .catch((err)=> next(err))
})

.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported in dishes/' + req.params.dishId + '/comments');
})

.delete(authenticate.verifyUser, (req,res,next)=> {
    Dishes.findById(req.params.dishId)
    .then((resp)=>{
        if(dish != null){   
            for( var i = (dish.comments.length = -1); i>=0 ; i--){
    dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }  
        else{
            err = new Error('Dish' , req.params.dishId + 'not found..!!');
            err.statusCode = 404;
            return next(err); 
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err)
    ).catch((err) => next(err))    
});

dishRouter.route('/:dishId/comments/:commentId')
 .get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((resp)=> {
        if(resp != null && resp.comments.id(req.params.commentId )!= null){
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json'); 
            res.json(resp.comments.id(req.params.commentId ))
        }
      else if(resp == null){
          err = new Error('Dish' , req.params.dishId + 'not found..!!');
          err.statusCode = 404;
          return next(err); // this will be handled in the app.js file in error handler
      }
      else{
        err = new Error('Comment ' , req.params.commentId + 'not found..!!');
        err.statusCode = 404;
        return next(err);
      }
    },(err) => next(err)).catch((err)=> next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode= 403;
    res.end('Post operation is not supported on /dishes/'+ req.param.dishId + '/comments/' + req.params.commentId);
})

.put(authenticate.verifyUser, (req,res,next)=> {
    Dishes.findById(req.params.dishId)
    .then((resp)=> {
        if(resp != null && resp.comments.id(req.params.commentId )!= null){
            // update a documnt inside a document
          if(req.body.rating){
            resp.comments.id(req.params.commentId).rating= req.body.rating;
          }
          if(req.body.comment){
            resp.comments.id(req.params.commentId).comment= req.body.comment;
          }
            resp.save().then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err));
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json'); 
            res.json(resp.comments.id(req.params.commentId ))
        }
      else if(resp == null){
          err = new Error('Dish' , req.params.dishId + 'not found..!!');
          err.statusCode = 404;
          return next(err); // this will be handled in the app.js file in error handler
      }
      else{
        err = new Error('Comment ' , req.params.commentId + 'not found..!!');
        err.statusCode = 404;
        return next(err);
      }
    },(err) => next(err))
    .catch((err)=> next(err));
    })

.delete(authenticate.verifyUser, (req,res,next)=> {
    Dishes.findById(req.params.dishId)
    .then((resp)=>{
        if(resp != null && resp.comments.id(req.params.commentId )!= null){
            resp.comments.id(req.params.commentsId).remove();
            resp.save().then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err));
        }   else if(resp == null){
            err = new Error('Dish' , req.params.dishId + 'not found..!!');
            err.statusCode = 404;
            return next(err); // this will be handled in the app.js file in error handler
        }
        else{
          err = new Error('Comment ' , req.params.commentId + 'not found..!!');
          err.statusCode = 404;
          return next(err);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err)=> next(err));
   
});

module.exports = dishRouter;




// app.all('/dishes', (req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// });

// app.get('/dishes', (req,res,next)=>{
//     res.end('We will sent you all the dishes!');
// });

// app.post('/dishes',(req,res,next) => {
//     res.end('Will add the dish: '+ req.body.name + ' with details '+ req.body.description)
// });

// app.put('/dishes', (req,res,next) => {
//     res.statusCode = 403;
//     res.end('Put operation not supported in dishes!');
// });

// app.delete('/dishes', (req,res,next)=> {
//     res.end('Deleting all dishes!!');
// });

// app.get('/dishes/:dishId', (req,res,next) => {
//     res.end('We will send details of the dish :'+ req.params.dishId + ' to you');
// });

// app.post('/dishes/:dishId', (req,res,next) => {
//     res.statusCode= 403;
//     res.end('Post operation is not supported on /dishes/'+ req.param.dishId)
// });

// app.put('/dishes/:dishId', (req,res,next)=> {
//     res.write('Updating the dish:'+ req.params.dishId + '/n');
//     res.end('Will update the dish: '+ req.body.name +' with details: '+ req.body.description)
// });

// app.delete('/dishes/:dishId', (req,res,next)=> {
//     res.end('Deleting dish : '+ req.params.dishId);
// });
