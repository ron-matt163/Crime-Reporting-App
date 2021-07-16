var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var multer = require('multer');
var http = require('http');
var path = require('path');

var session = require('express-session');

var userController = require('./controllers/userController');
var citizenFeatureController = require('./controllers/citizenFeatureController');


var app = express();
//set up template engine
var mysql = require('mysql');
const adminFeatureController = require('./controllers/adminFeatureController');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'ocrs',
    multipleStatements: true
});

try {
    connection.connect();
    console.log('Connected to the database');
} catch(err) {
    console.log("Database connection error:\n" + err);
}

global.db = connection;

app.set('view engine','ejs');

//static files
app.use(express.static('./public'));

const fileStorageEngine = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, path.join(__dirname, '/public/uploads/'));
    },
    filename: (req,file,cb) => {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
    });

const upload = multer({storage: fileStorageEngine});
global.upload = upload;

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
    }));

global.message = "";

//fire controllers
userController(app);
citizenFeatureController(app);
adminFeatureController(app);

app.get('/about',(req,res) => {
    res.render('about');
});
//listen to port
app.listen(3000);
console.log('You are listening to port 3000');