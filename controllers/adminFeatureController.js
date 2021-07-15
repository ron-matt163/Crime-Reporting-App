var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
message = "Login Successful";
module.exports = app => {

    app.get('/adminDashboard/:username',(req,res) => {
        res.render('adminDashboard', { message: message });
        username=req.params.username;
    });

    app.get('/admin/policeStationList', (req,res) => {
        message = '';
        var sql = "SELECT * from `Police_Station`";
        db.query(sql, function(err,results) {
            res.render('adminPoliceStationList', { policestations: results })
        });
    });


    app.get('/admin/changePassword',(req,res) => { 
        res.render('changePassword');
    });
    
    app.post('/admin/changePassword',urlencodedParser,(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var confpassword = post.confPassword;
            var sql = "UPDATE `User` SET `password` = '" + confpassword + "'  WHERE username = '" + username + "'";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '0';
                    throw err;
                }
                else {
                  message = 'Your password was changed.';
                }
                res.redirect('/adminDashboard/'+username);
             });
        }
        else {
            res.redirect('/admin/changePassword');
        }
    });

    app.get('/admin/addPoliceOfficers',(req,res) => {
        message = '';
        res.render('adminAddPoliceOfficers');
    });

    app.post('/admin/addPoliceOfficers',urlencodedParser,(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var name = post.name;
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
            var type= "Police";
            var sql = "INSERT INTO `User`(`name`,`username`,`password`,`phone`,`email`,`dob`,`address`,`city`,`state`,`country`,`photo_file`,`type`) VALUES ('" + name + "','" + username + "','" + password + "','" + phone + "','" + email + "','" + dob + "','" + address + "','" + city + "','" + state + "','" + country + "','" + photo + "','" + type + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '0';
                    throw err;
                }
                else {
                  message = 'New police has been added.';
                }
                res.redirect('/adminDashboard/'+username);
             });
        }
        else {
            res.redirect('/admin/addPoliceOfficers');
        }
    });

    // app.get('/admin/addCrimeDetails',(req,res) => {
    //     message = '';
    //     var sql = "SELECT * FROM `Criminal`";
    //     var criminals;
    //     var courts;
    //     db.query(sql, function(err,results) {
    //         criminals = results;
    //     });
    //     var sql = "SELECT * FROM `Court`";
    //     db.query(sql, function(err,results) {
    //         courts = results;
    //     });
    //     res.render('adminAddCrimeDetails',{criminals:criminals},{courts:courts});
    // });

    app.get('/admin/addCriminal',(req,res) => {
        message = '';
        var sql = "SELECT * FROM `Prison`";
        db.query(sql, function(err,results) {
            res.render('adminAddCriminal',{ prisons: results });
        });
        
    });

    app.post('/admin/addCriminal',urlencodedParser,(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var name = post.name;
            var height = post.height;
            var weight = post.weight;
            var prison_id = post.prison_id;
            var phone= post.phone;
            var email= post.email;
            var dob= post.dob;
            var address= post.address;
            var city= post.city;
            var state= post.state;
            var country= post.country;
            var photo= post.photo;
            var sql = "INSERT INTO `Criminal`(`name`,`height`,`weight`,`prison_id`,`phone`,`email`,`dob`,`address`,`city`,`state`,`country`,`photo_file`) VALUES ('" + name + "','" + height + "','" + weight + "','" + prison_id + "','" + phone + "','" + email + "','" + dob + "','" + address + "','" + city + "','" + state + "','" + country + "','" + photo + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '0';
                    throw err;
                }
                else {
                  message = 'New criminal has been added.';
                }
                res.redirect('/adminDashboard/'+username);
             });
        }
        else {
            res.redirect('/admin/addCriminal');
        }
    });

    app.get('/admin/addCourt',(req,res) => {
        message = '';
        var sql = "SELECT * FROM `Court_Type`";
        db.query(sql, function(err,results) {
            res.render('adminAddCourt',{ courttypes: results });
        });
    });

    app.post('/admin/addCourt',urlencodedParser,(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var courttype = post.courttype;
            var courtname = post.courtname;
            var address = post.address;
            var city = post.city;
            var sql = "INSERT INTO `Court`(`court_name`,`court_type`,`address`,`city`) VALUES ('" + courtname + "','" + courttype + "','" + address + "','" + city + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '0';
                    throw err;
                }
                else {
                  message = 'New court has been added.';
                }
                res.redirect('/adminDashboard/'+username);
             });
        }
        else {
            res.redirect('/admin/addCourt');
        }
    });



};