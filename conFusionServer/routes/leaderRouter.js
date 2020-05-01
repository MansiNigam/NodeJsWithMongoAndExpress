const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
.all((req,res,next)=> {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=> {
    res.end('We will show you all the leaders detail');
})
.post((req,res,next) => {
    res.end('We will add the leaders Details with leader name :' +req.body.leaderName + 'leader location  '+ req.body.leaderLoc);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("This operation of put is not supported for leaders");
})
.delete((req,res,next) => {
    res.end('deleting all leaders entries');
});

leaderRouter.route('/:leaderId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
})
.get((req,res,next)=> {
res.end('Showing you the detail list of leaders '+ req.params.leaderId);
})
.post((req,res,next) => {
    res.statusCode= 403;
    res.end('Post operation is not supported on /leaders/'+ req.param.leaderId);
})

.put((req,res,next) => {
    res.write('Updating the leaders entry :'+ req.params.leaderId + '\n');
    res.end('Will update the leaders entry : '+ req.body.name + ' leader location '+ req.body.location )
})

.delete((req,res,next) => {
    res.end('Deleting leaders entry : '+ req.params.leaderId);
});

module.exports = leaderRouter;