const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'public/images');
    },

    filename:(req, file, cb) => {
        // by this the file will be stored with its original name
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg | jpeg | png | gif)$/)){
        return cb(new Error('You can upload only image files..'), false);
    }
    cb(null, true);
};

const upload = multer({storage: storage , fileFilter: imageFileFilter})

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.options(cors.corsWithOptions , (req,res) => {
    res.sendStatus(200);
})

.get(cors.cors, authenticate.verifyAdmin, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('Get operation not supported on /imageUpload!');
})
.post(cors.corsWithOptions, authenticate.verifyAdmin, authenticate.verifyUser, upload.single('imageFile'), (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyAdmin, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /imageUpload!');
})
.delete(cors.corsWithOptions, authenticate.verifyAdmin, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /imageUpload!');
})

module.exports = uploadRouter;