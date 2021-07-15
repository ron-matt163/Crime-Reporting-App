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
            var uname= post.username;
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
            var sql = "INSERT INTO `User`(`name`,`username`,`password`,`phone`,`email`,`dob`,`address`,`city`,`state`,`country`,`photo_file`,`type`) VALUES ('" + name + "','" + uname + "','" + password + "','" + phone + "','" + email + "','" + dob + "','" + address + "','" + city + "','" + state + "','" + country + "','" + photo + "','" + type + "')";
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

    app.get('/admin/addCrimeDetails',(req,res) => {
        message = '';
        var sql = "SELECT * FROM `Criminal`;SELECT * FROM `Court`;SELECT * FROM Crime_Category;";
        db.query(sql, function(err,results) {
            if(err) throw err;
            var criminals = results[0];
            var courts = results[1];
            var categories = results[2];
            res.render('adminAddCrimeDetails',{criminals:criminals,courts:courts,categories:categories});
        });
    });

    app.post('/admin/addCrimeDetails',urlencodedParser,(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var criminal_id = post.criminal;
            var category = post.category;
            var court_id = post.court;
            var date = post.date;
            var place= post.place;
            var description= post.description;
            var file= post.file;
            var crime_id;
            var sql = "INSERT INTO `Crime`(`category`,`court_id`,`date`,`description`,`photo_file`,`place`) VALUES ('" + category + "','" + court_id + "','" + date + "','" + description + "','" + file + "','" + place + "');";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '';
                    throw err;
                }
                crime_id = result.insertId;
                var sql1 = "INSERT INTO `Crime_Criminal` VALUES ('"+crime_id+"','"+criminal_id+"');";
                db.query(sql1,function(err,result) {
                    if(err) {
                        message = '';
                        throw err;
                    }
                    else {
                        message = 'Crime details added successfully';
                    }
                });
                message = 'Crime details added successfully';
                res.redirect('/adminDashboard/'+username);                
            });
        }
        else {
            res.redirect('/admin/addCrimeDetails');
        }
    });

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

    app.get('/admin/addPrison',(req,res) => {
        message = '';
        res.render('adminPrisonForm');
    });

    app.post('/admin/addPrison',urlencodedParser,(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var prisonname = post.prisonName;
            var prisontype = post.prisonType;
            var address = post.address;
            var city = post.city;
            var sql = "INSERT INTO `Prison`(`name`,`type`,`address`,`city`) VALUES ('" + prisonname + "','" + prisontype + "','" + address + "','" + city + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '0';
                    throw err;
                }
                else {
                  message = 'New prison has been added.';
                }
                res.redirect('/adminDashboard/'+username);
             });
        }
        else {
            res.redirect('/admin/addPrison');
        }
    });

    app.get('/admin/addPoliceStation',(req,res) => {
        message = '';
        res.render('adminPoliceStationForm');
    });

    app.post('/admin/addPoliceStation',urlencodedParser,(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var stationname = post.stationName;
            var phone = post.phone;
            var email = post.email;
            var address = post.address;
            var city = post.city;
            var state = post.state;
            var sql = "INSERT INTO `Police_Station`(`name`,`email`,`state`,`phone`,`address`,`city`) VALUES ('" + stationname + "','" + email + "','" + state + "','" + phone + "','" + address + "','" + city + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '0';
                    throw err;
                }
                else {
                  message = 'New police station has been added.';
                }
                res.redirect('/adminDashboard/'+username);
             });
        }
        else {
            res.redirect('/admin/addPoliceStation');
        }
    });

    app.get('/admin/addCrimeCategory',(req,res) => {
        message = '';
        res.render('adminCrimeCategoryForm');
    });

    app.post('/admin/addCrimeCategory',urlencodedParser,(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var categoryname = post.categoryName;
            var description = post.description;
            var sql = "INSERT INTO `Crime_Category`(`category`,`description`) VALUES ('" + categoryname + "','" + description + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '0';
                    throw err;
                }
                else {
                  message = 'New crime category has been added.';
                }
                res.redirect('/adminDashboard/'+username);
             });
        }
        else {
            res.redirect('/admin/addCrimeCategory');
        }
    });

    app.get('/admin/addCourtType',(req,res) => {
        message = '';
        res.render('adminCourtTypeForm');
    });  
    
    app.post('/admin/addCourtType',urlencodedParser,(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var courttype = post.courtType;
            var description = post.description;
            var sql = "INSERT INTO `Court_Type`(`type`,`description`) VALUES ('" + courttype + "','" + description + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '0';
                    throw err;
                }
                else {
                  message = 'New court type has been added.';
                }
                res.redirect('/adminDashboard/'+username);
             });
        }
        else {
            res.redirect('/admin/addCourtType');
        }
    });


};