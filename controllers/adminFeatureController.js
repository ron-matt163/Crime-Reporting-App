var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
message = "Login Successful";
var message1 = "";

module.exports = app => {

    app.get('/adminDashboard/:username',(req,res) => {
        res.render('adminDashboard', { message: message });
        message='';
        username=req.params.username;
    });

    app.get('/admin/policeStationList', (req,res) => {
        message = '';
        var sql = "SELECT * from `Police_Station`";
        db.query(sql, function(err,results) {
            res.render('adminPoliceStationList', { policestations: results })
        });
    });

    app.get('/admin/addCirculars',(req,res) => {
        message = '';
        res.render('adminCircularForm.ejs');
    });

    app.post('/admin/addCirculars',upload.single("file"),(req,res) => { 
        message = '';
        console.log(req.file);
        if(req.method == 'POST') {
            var post = req.body;
            var title = post.title;
            var description = post.description;
            var filename  = req.file.filename;
            var sql= "INSERT INTO `Article`(`title`,`filename`,`description`)  VALUES ('" + title + "','" + filename + "','" + description + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '';
                    throw err;
                }
                else {
                  message = 'Circular was published successfully';
                }
                res.redirect('/adminDashboard/'+username);
             });
        }
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

    app.get('/admin/policeReport', (req,res) => {
        message = '';
        var sql = "SELECT * FROM `User` WHERE type = 'Police'";
        db.query(sql, function(err, rows, results) {
            for(i=0;i<rows.length;i++) {
                date = rows[i].dob.toString().split(" ");
                rows[i].dob = [date[1], date[2], date[3]].join(" ");
                console.log(rows[i].dob);
            }
            res.render('adminPoliceReport', { police: rows, message: message1 });
            message1 = '';
        });
    });

    app.get('/admin/policeReport/delete/:user', (req,res) => {
        message = '';
        var usern = req.params.user;
        var sql = "DELETE FROM `User` WHERE username = '" + usern + "'";
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.'
            }

            res.redirect('/admin/policeReport');
        });
    });

    app.get('/admin/policeReport/edit/:user', (req,res) => {
        message = '';
        var usern = req.params.user;
        var sql = "SELECT * FROM `User` WHERE username = '" + usern + "'";
        db.query(sql, function(err, rows, results) {
            res.render('adminPoliceOfficerEdit', { users: rows[0] })
        });        
    });
    
    app.post('/admin/policeReport/edit/:user',urlencodedParser,(req,res) => { 
        message = '';
        var usern = req.params.user;
        if(req.method == 'POST') {
            var post = req.body;
            var name = post.name;
            var phone = post.phone;
            var email = post.email;
            var dob = post.dob;
            var address = post.address;
            var city = post.city;
            var state = post.state;
            var country = post.country;
            var photo= post.photo;
            var sql = "UPDATE `User` SET `name` = '" + name + "',`phone` = '" + phone + "',`email` = '" + email + "',`dob` = '" + dob + "',`address` = '" + address + "',`city` = '" + city + "',`state` = '" + state + "',`country` = '" + country + "',`photo_file` = '" + photo + "'  WHERE username = '" + usern + "'";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message1 = '';
                    throw err;
                }
                else {
                  message1 = 'Police record has been updated';
                }
                res.redirect('/admin/policeReport');
             });
        }
        else {
            res.redirect('/admin/policeReport/edit/'+usern);
        }
    });

    app.get('/admin/prisonReport',(req,res) => {
        message = '';
        var sql = "SELECT * FROM `Prison`";
        db.query(sql, function(err, rows, results) {
            res.render('adminPrisonReport', { prisons: rows, message: message1 });
            message1 = '';
        });
    });

    app.get('/admin/prisonReport/delete/:prison_id', (req,res) => {
        message = '';
        var prison_id = req.params.prison_id;
        var sql = "DELETE FROM `Prison` WHERE id = '" + prison_id + "'";
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.';
            }

            res.redirect('/admin/prisonReport');
        });
    });

    app.get('/admin/prisonReport/edit/:prison_id', (req,res) => {
        message = '';
        var prison_id = req.params.prison_id;
        var sql = "SELECT * FROM `Prison` WHERE id = '" + prison_id + "'";
        db.query(sql, function(err, rows, results) {
            res.render('adminPrisonEdit', { prisons: rows[0] });
        });        
    });

    app.post('/admin/prisonReport/edit/:prison_id',urlencodedParser,(req,res) => { 
        message = '';
        var prison_id = req.params.prison_id;
        if(req.method == 'POST') {
            var post = req.body;
            var name = post.prisonName;
            var type = post.prisonType;
            var address = post.address;
            var city = post.city;

            var sql = "UPDATE `Prison` SET `name` = '" + name + "',`type` = '" + type + "',`address` = '" + address + "',`city` = '" + city + "' WHERE id = '" + prison_id + "'";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message1 = '';
                    throw err;
                }
                else {
                  message1 = 'Prison record has been updated';
                }
                res.redirect('/admin/prisonReport');
             });
        }
        else {
            res.redirect('/admin/prisonReport/edit/'+prison_id);
        }
    });

    app.get('/admin/policeStationReport', (req,res) => {
        message = '';
        var sql = "SELECT * FROM `Police_Station`";
        db.query(sql, function(err, rows, results) {
            res.render('adminPoliceStationReport', { police: rows, message: message1 });
            message1 = '';
        });
    });
    
    app.get('/admin/policeStationReport/delete/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql = "DELETE FROM `Police_Station` WHERE id = " + id;
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.'
            }
    
            res.redirect('/admin/policeStationReport');
        });
    });
    
    //Crime category Report
    
    app.get('/admin/crimeCategoryReport', (req,res) => {
        message = '';
        var sql = "SELECT * FROM `Crime_Category`";
        db.query(sql, function(err, rows, results) {
            res.render('adminCrimeCategoryReport', { crime: rows, message: message1 });
            message1 = '';
        });
    });
    
    app.get('/admin/crimeCategoryReport/delete/:category', (req,res) => {
        message = '';
        var category = req.params.category;
        var sql = "DELETE FROM `Crime_Category` WHERE category = '" + category+"'";
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.'
            }
    
            res.redirect('/admin/crimeCategoryReport');
        });
    });
        
    // Court Type Report
    app.get('/admin/courtTypeReport', (req,res) => {
        message = '';
        var sql = "SELECT * FROM `Court_Type`";
        db.query(sql, function(err, rows, results) {
            res.render('adminCourtTypeReport', { court: rows, message: message1 });
            message1 = '';
        });
    });
    
    app.get('/admin/courtTypeReport/delete/:type', (req,res) => {
        message = '';
        var type = req.params.type
        var sql = "DELETE FROM `Court_Type` WHERE type = '" + type+"'" ;
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.';
            }
    
            res.redirect('/admin/courtTypeReport');
        });
    });

    app.get('/admin/courtTypeReport/edit/:type', (req,res) => {
        message = '';
        var type = req.params.type;
        var sql = "SELECT * FROM `Court_Type` WHERE type = '" + type + "'";
        db.query(sql, function(err, rows, results) {
            res.render('adminCourtTypeEdit', { type: rows[0] })
        });        
    });
    
    app.post('/admin/courtTypeReport/edit/:type',urlencodedParser,(req,res) => { 
        message = '';
        var type = req.params.type;
        if(req.method == 'POST') {
            var post = req.body;
            var typenew = post.type;
            var description = post.description;
            var sql = "UPDATE `Court_Type` SET  `description` = '" + description+"',`type` = '" + typenew+"' WHERE type = '" + type + "'";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message1 = '';
                    throw err;
                }
                else {
                  message1 = 'Court Type record has been updated';
                }
                res.redirect('/admin/courtTypeReport');
             });
        }
        else {
            res.redirect('/admin/courtTypeReport/edit/'+usern);
        }
    });

    app.get('/admin/viewCirculars',(req,res) => {
        message = '';
        var sql = "SELECT * FROM `Article`";
        db.query(sql, function(err, rows, results) {
            res.render('adminViewCircular', { circulars: rows, message: message1 });
            message1 = '';
        });
    });
    
    app.get('/admin/viewCirculars/delete/:article_id', (req,res) => {
        message = '';
        var article_id = req.params.article_id;
        var sql = "DELETE FROM `Article` WHERE id = '" + article_id + "'";
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.';
            }

            res.redirect('/admin/viewCirculars');
        });
    });

    //Crime Report
    app.get('/admin/crimeReport', (req,res) => {
        message = '';
        var sql = "SELECT A.id, A.category, B.court_name, A.date, A.description, A.place FROM Court B, Crime A WHERE B.id = A.court_id";
        db.query(sql, function(err, rows, results) {
            for(i=0;i<rows.length;i++) {
                date = rows[i].date.toString().split(" ");
                rows[i].date = [date[1], date[2], date[3]].join(" ");
                console.log(rows[i].date);
            }
            res.render('adminCrimeReport', { crime: rows, message: message1 });
            message1 = '';          
        });
    });

    app.get('/admin/crimeReport/delete/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql = "DELETE FROM `Crime` WHERE id = " + id + "";
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.'
            }

            res.redirect('/admin/crimeReport');
        });
    });

    app.get('/admin/crimeReport/edit/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql = "SELECT A.id, A.category, B.court_name, A.date, A.description, A.place FROM Court B, Crime A WHERE B.id = A.court_id AND A.id = " + id + ";SELECT * FROM Court;SELECT * FROM Crime_Category";
        db.query(sql, function(err, rows, results) {
            res.render('adminCrimeReportEdit', { crimes: rows[0], courts: rows[1], categories:rows[2] })
        });        
    });

    app.post('/admin/crimeReport/edit/:id',urlencodedParser,(req,res) => { 
        message = '';
        var id = req.params.id;
        if(req.method == 'POST') {
            var post = req.body;
            var category = post.category;
            var court = post.court;
            var date = post.date;
            var description = post.description;
            var place = post.place;
            var sql = "UPDATE `Crime` SET `category` = '" + category + "',`court_id` = " + court + ",`date` = '" + date + "',`description` = '" + description + "',`place` = '" + place + "'  WHERE id = " + id + "";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message1 = '';
                    throw err;
                }
                else {
                  message1 = 'Crime record has been updated';
                }
                res.redirect('/admin/crimeReport');
             });
        }
        else {
            res.redirect('/admin/crimeReport/edit/'+id);
        }
    });

    //Criminal Report
    app.get('/admin/criminalReport', (req,res) => {
        message = '';
        var sql = "SELECT A.id, A.name, A.phone, A.height, A.weight, B.name AS prison, A.email, A.dob, A.address, A.city, A.state, A.country, A.photo_file FROM Criminal A, Prison B where A.prison_id = B.id";
        db.query(sql, function(err, rows, results) {
            for(i=0;i<rows.length;i++) {
                date = rows[i].dob.toString().split(" ");
                rows[i].dob = [date[1], date[2], date[3]].join(" ");
                console.log(rows[i].dob);
            }
            res.render('adminCriminalReport', { criminal: rows, message: message1 })
            message1 = '';
        });
    });

    app.get('/admin/criminalReport/delete/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql = "DELETE FROM `Criminal` WHERE id = " + id + "";
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.'
            }
            res.redirect('/admin/criminalReport');
        });
    });

    app.get('/admin/criminalReport/edit/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql = "SELECT A.id, A.name, A.phone, A.height, A.weight, B.name AS prison, A.email, A.dob, A.address, A.city, A.state, A.country, A.photo_file FROM Criminal A, Prison B where A.prison_id = B.id AND A.id = " + id + ";SELECT * FROM Prison";
        db.query(sql, function(err, rows, results) {
            res.render('adminCriminalReportEdit', { criminals: rows[0], prisons: rows[1] })
        });        
    });

    app.post('/admin/criminalReport/edit/:id',urlencodedParser,(req,res) => { 
        message = '';
        var id = req.params.id;
        if(req.method == 'POST') {
            var post = req.body;
            var name = post.name;
            var height = post.height;
            var weight = post.weight;
            var prison = post.prison_id;
            var phone = post.phone;
            var email = post.email;
            var dob = post.dob;
            var address = post.address;
            var city = post.city;
            var state = post.state;
            var country = post.country;
            var photo_file = post.photo_file;
            var sql = "UPDATE `Criminal` SET `name` = '" + name + "',`height` = " + height + ",`weight` = '" + weight + "',`prison_id` = '" + prison + "',`phone` = '" + phone + "',`email` = '" + email + "',`dob` = '" + dob + "',`address` = '" + address + "',`city` = '" + city + "',`state` = '" + state + "',`country` = '" + country + "',`photo_file` = '" + photo_file + "' WHERE id = " + id + "";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message1 = '';
                    throw err;
                }
                else {
                  message1 = 'Criminal record has been updated';
                }
                res.redirect('/admin/criminalReport');
             });
        }
        else {
            res.redirect('/admin/criminalReport/edit/'+id);
        }
    });

    //Court Report
    app.get('/admin/courtReport', (req,res) => {
        message = '';
        var sql = "SELECT * FROM Court";
        db.query(sql, function(err, rows, results) {
            res.render('adminCourtReport', { court: rows, message: message1 })
        });
    });

    app.get('/admin/courtReport/delete/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql = "DELETE FROM `Court` WHERE id = " + id + "";
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.'
            }
            res.redirect('/admin/courtReport');
        });
    });

    app.get('/admin/courtReport/edit/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql = "SELECT * FROM `Court` WHERE id = " + id + "; SELECT * FROM `Court_Type`";
        db.query(sql, function(err, rows, results) {
            res.render('adminCourtReportEdit', { courts: rows[0], courttypes: rows[1] })
        });        
    });

    app.post('/admin/courtReport/edit/:id',urlencodedParser,(req,res) => { 
        message = '';
        var id = req.params.id;
        if(req.method == 'POST') {
            var post = req.body;
            var courtname = post.courtname;
            var courttype = post.courttype;
            var address = post.address;
            var city = post.city;
            var sql = "UPDATE `Court` SET `court_name` = '" + courtname + "',`court_type` = '" + courttype + "',`address` = '" + address + "',`city` = '" + city + "' WHERE id = " + id + "";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message1 = '';
                    throw err;
                }
                else {
                  message1 = 'Court record has been updated';
                }
                res.redirect('/admin/courtReport');
             });
        }
        else {
            res.redirect('/admin/courtReport/edit/'+id);
        }
    });

};