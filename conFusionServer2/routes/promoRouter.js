const express = require('express');
const bodyParser = require('body-parser');
const Promotion = require('../models/promotions');
const authenticate = require('../authenticate');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.get((req,res,next)=> {
    Promotion.find({}).then((promoData)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json'); 
        res.json(promoData)
    }, (err) => next(err)
).catch((err)=> next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    Promotion.create(req.body).then((promoData)=> {
        console.log('Promotion Data added...', promoData);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promoData);
    }, (err) => next(err)
    ).catch((err)=> next(err))
})

.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("This operation of put is not supported for promotions");
})

.delete(authenticate.verifyUser, (req,res,next) => {
    Promotion.remove({})
    .then((promoData)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promoData);
    }, (err) => next(err)
    ).catch((err) => next(err))  
});

// data with promotion id
promoRouter.route('/:promoId')

.get((req,res,next)=> {
    Promotion.findById(req.params.promoId)
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err)
    ).catch((err)=> next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode= 403;
    res.end('Post operation is not supported on /promotions/'+ req.params.promoId);
})

.put(authenticate.verifyUser, (req,res,next) => {
    Promotion.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true})
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err)
    ).catch((err)=> next(err));
})

.delete(authenticate.verifyUser, (req,res,next) => {
    Promotion.findByIdAndRemove(req.params.promoId)
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=> next(err))
    .catch((err)=> next(err));
});

module.exports = promoRouter;