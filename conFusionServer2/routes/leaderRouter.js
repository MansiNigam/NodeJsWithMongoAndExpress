const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
.options(cors.corsWithOptions , (req,res) => {
    res.sendStatus(200);
})

.get(cors.cors, (req,res,next)=> {
    Leaders.find({}).then((leadersData)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json'); 
        res.json(leadersData)
    }, (err) => next(err)
).catch((err)=> next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Leaders.create(req.body).then((leadersData)=> {
        console.log('Leaders Data added...', leadersData);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leadersData);
    }, (err) => next(err)
    ).catch((err)=> next(err))
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("This operation of put is not supported for leaders");
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Leaders.remove({})
    .then((leadersData)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leadersData);
    }, (err) => next(err)
    ).catch((err) => next(err))  
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions , (req,res) => {
    res.sendStatus(200);
})

.get(cors.cors, (req,res,next)=> {
    Leaders.findById(req.params.Leaders)
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err)
    ).catch((err)=> next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode= 403;
    res.end('Post operation is not supported on /leaders/'+ req.params.leaderId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
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

.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=> next(err))
    .catch((err)=> next(err));
});

module.exports = leaderRouter;