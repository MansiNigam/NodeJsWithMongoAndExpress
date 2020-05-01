const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.all((req,res,next)=> {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=> {
    res.end('We will show you all the promotion details');
})
.post((req,res,next) => {
    res.end('We will add the promotion Details with promotionDetail :' +req.body.promotionDetail);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("This operation of put is not supported for promotions");
})
.delete((req,res,next) => {
    res.end('deleting all promotions entries');
});

promoRouter.route('/:promoId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
})
.get((req,res,next)=> {
res.end('showing you the detail of the promotion '+ req.params.promoId);
})
.post((req,res,next) => {
    res.statusCode= 403;
    res.end('Post operation is not supported on /promotions/'+ req.param.promoId);
})

.put((req,res,next) => {
    res.write('Updating the promotion entry :'+ req.params.promoId + '\n');
    res.end('Will update the promo entry : '+ req.body.name )
})

.delete((req,res,next) => {
    res.end('Deleting promo entry : '+ req.params.promoId);
});

module.exports = promoRouter;