const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());
leaderRouter.route('/')

.get((req,res,next)=> {
    Leaders.find({}).then((leadersData)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json'); 
        res.json(leadersData)
    }, (err) => next(err)
).catch((err)=> next(err));
})

.post((req,res,next) => {
    Leaders.create(req.body).then((leadersData)=> {
        console.log('Leaders Data added...', leadersData);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leadersData);
    }, (err) => next(err)
    ).catch((err)=> next(err))
})

.put((req,res,next) => {
    res.statusCode = 403;
    res.end("This operation of put is not supported for leaders");
})

.delete((req,res,next) => {
    Leaders.remove({})
    .then((leadersData)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leadersData);
    }, (err) => next(err)
    ).catch((err) => next(err))  
});

leaderRouter.route('/:leaderId')

.get((req,res,next)=> {
    Leaders.findById(req.params.Leaders)
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err)
    ).catch((err)=> next(err));
})

.post((req,res,next) => {
    res.statusCode= 403;
    res.end('Post operation is not supported on /leaders/'+ req.params.leaderId);
})

.put((req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true})
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err)
    ).catch((err)=> next(err));
   })

.delete((req,res,next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=> next(err))
    .catch((err)=> next(err));
});

module.exports = leaderRouter;