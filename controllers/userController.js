var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = app => {
    app.get(['/','/home'],(req,res) => {
        res.render('index',{message: ""});
    });
    app.post(['/','/home'],urlencodedParser,(req,res) => {
        var sess = req.session; 
 
        if(req.method == "POST"){
           var post  = req.body;
           var username= post.username;
           var password= post.password;
          
           var sql="SELECT name, username FROM `User` WHERE `username`='"+username+"' and password = '"+password+"'";                           
           db.query(sql, function(err, results){      
              if(results.length){
                 req.session.user = results[0];
                 console.log(results[0].name);
                 global.user = results[0];
                 username = user.username;
                 message = "Login Successful"
                 res.redirect('/citDashboard/'+username);
              }
              else{
                 message = 'Wrong Credentials.';
                 res.render('index',{message: message});
              }                      
           });
        } else {
           res.render('index',{message: message});
        }
    });
    app.get('/register',(req,res) => {
        res.render('register');
    });
    app.post('/register',urlencodedParser,(req,res) => {
        res.json(req.body)
    });
    app.get('/register-done',(req,res) => {
        res.render('register-done');
    });
    app.post('/register-done',urlencodedParser,(req,res) => {
        var message = '';
        if(req.method == "POST"){
           var post  = req.body;
           var mid = post.mname;
           if(mid.length != 0) {
               mid += " ";
           }
           var name= post.fname + " " + mid + post.lname;
           var username= post.username;
           var password= post.password;
           var confPassword= post.confPassword;
           var phone= post.phone;
           var email= post.email;
           var dob= post.dob;
           var address= post.address;
           var city= post.city;
           var state= post.state;
           var country= post.country;
           var photo= post.photo;
           var type= "Citizen";
      
           var sql = "INSERT INTO `User`(`name`,`username`,`password`,`phone`,`email`,`dob`,`address`,`city`,`state`,`country`,`photo_file`,`type`) VALUES ('" + name + "','" + username + "','" + password + "','" + phone + "','" + email + "','" + dob + "','" + address + "','" + city + "','" + state + "','" + country + "','" + photo + "','" + type + "')";
      
           var query = db.query(sql, function(err, result) {
              if (err) {
                  message = "Server error! Please try again later";
                  throw err;
              }
              else {
                message = "Success! Your account has been created.";
              }
              var fn = (name.split(' '))[0];
              res.render('register-done',{message: message, fname:fn});
           });
      
        } else {
           res.render('register-done');
        }
    });
    app.get('/logout',(req,res) => {

        req.session.destroy(function(err) {
            console.log(err);
        });
        user = null;
        res.redirect('/');
    });
};