var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var session = require('express-session');

var userController = require('./controllers/userController');
var citizenFeatureController = require('./controllers/citizenFeatureController');


var app = express();
//set up template engine
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'ocrs'
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

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
    }));


//fire controllers
userController(app);
citizenFeatureController(app);

app.get('/about',(req,res) => {
    res.render('about');
});
//listen to port
app.listen(3000);
console.log('You are listening to port 3000');