const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('We will sent you all the dishes!');
})
.post((req,res,next) => {
    res.end('Will add the dish: '+ req.body.name + ' with details '+ req.body.description)
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported in dishes!');
})

.delete((req,res,next)=> {
    res.end('Deleting all dishes!!');
});

dishRouter.route('/:dishId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

 .get((req,res,next) => {
    res.end('We will send details of the dish :'+ req.params.dishId + ' to you');
})

.post( (req,res,next) => {
    res.statusCode= 403;
    res.end('Post operation is not supported on /dishes/'+ req.param.dishId)
})

.put((req,res,next)=> {
    res.write('Updating the dish:'+ req.params.dishId + '/n');
    res.end('Will update the dish: '+ req.body.name +' with details: '+ req.body.description)
})

.delete((req,res,next)=> {
    res.end('Deleting dish : '+ req.params.dishId);
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
