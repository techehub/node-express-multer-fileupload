var express = require('express')
var multer = require('multer')
var path = require('path')
const UPLOAD_PATH = 'uploads';

var fs = require('fs')

var app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        //cb(null, false);
        return cb(new Error('Only image files are allowed!'), false);

    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get('/file', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    var data = fs.readFileSync('fileupload.html')
    console.log(data)
    res.write(data)
})

app.get('/files', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    var data = fs.readFileSync('multiupload.html')
    console.log(data)
    res.write(data)
})

app.post('/fileupload', upload.single('file'), (req, res) => {
    try {
        console.log('filename:' + req.file.filename)
        console.log('org-filename:' + req.file.originalname)
        res.send('file received:' + req.file.filename)
    } catch (err) {
        console.error(err)
    }
})

app.post('/multiupload', upload.array('files', 10), (req, res) => {
    try {
        console.log('filename:' + req.files)
        res.send('saved successfully')
    } catch (err) {
        console.error(err)
    }
})

app.listen(4000)