var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
message = "Login Successful";
var message1 = "";

module.exports = app => {

    app.get('/policeDashboard/:username',(req,res) => {
        res.render('policeDashboard', { message: message });
        message='';
        username=req.params.username;
    });

    app.get('/police/addCirculars',(req,res) => {
        message = '';
        res.render('policeCircularForm.ejs');
    });

    app.post('/police/addCirculars',upload.single("file"),(req,res) => { 
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
                res.redirect('/policeDashboard/'+username);
             });
        }
    });

    app.get('/police/changePassword',(req,res) => { 
        res.render('changePassword');
    });
    
    app.post('/police/changePassword',urlencodedParser,(req,res) => { 
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
                res.redirect('/policeDashboard/'+username);
             });
        }
        else {
            res.redirect('/police/changePassword');
        }
    });

    app.get('/police/addCrimeDetails',(req,res) => {
        message = '';
        var sql = "SELECT * FROM `Criminal`;SELECT * FROM `Court`;SELECT * FROM Crime_Category;";
        db.query(sql, function(err,results) {
            if(err) throw err;
            var criminals = results[0];
            var courts = results[1];
            var categories = results[2];
            res.render('policeAddCrimeDetails',{criminals:criminals,courts:courts,categories:categories});
        });
    });

    app.post('/police/addCrimeDetails',upload.single("file"),(req,res) => { 
        message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var criminal_id = post.criminal;
            var category = post.category;
            var court_id = post.court;
            var date = post.date;
            var place= post.place;
            var description= post.description;
            if(req.file !== undefined) {
                var photo= req.file.filename;
            }
            else {
                var photo = post.file;
            }
            var crime_id;
            var sql = "INSERT INTO `Crime`(`category`,`court_id`,`date`,`description`,`photo_file`,`place`) VALUES ('" + category + "','" + court_id + "','" + date + "','" + description + "','" + photo + "','" + place + "');";
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
                res.redirect('/policeDashboard/'+username);                
            });
        }
        else {
            res.redirect('/police/addCrimeDetails');
        }
    });

    app.get('/police/addCriminal',(req,res) => {
        message = '';
        var sql = "SELECT * FROM `Prison`";
        db.query(sql, function(err,results) {
            res.render('policeAddCriminal',{ prisons: results });
        });
        
    });

    app.post('/police/addCriminal',upload.single("file"),(req,res) => { 
        message = '';
        console.log(req.file);
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
            if(req.file !== undefined) {
                var photo= req.file.filename;
            }
            else {
                var photo = post.photo;
            }
            var sql = "INSERT INTO `Criminal`(`name`,`height`,`weight`,`prison_id`,`phone`,`email`,`dob`,`address`,`city`,`state`,`country`,`photo_file`) VALUES ('" + name + "','" + height + "','" + weight + "','" + prison_id + "','" + phone + "','" + email + "','" + dob + "','" + address + "','" + city + "','" + state + "','" + country + "','" + photo + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '';
                    throw err;
                }
                else {
                  message = 'New criminal has been added.';
                }
                res.redirect('/policeDashboard/'+username);
             });
        }
        else {
            res.redirect('/police/addCriminal');
        }
    });


    app.get('/police/policeReport', (req,res) => {
        message = '';
        var sql = "SELECT * FROM `User` WHERE type = 'Police'";
        db.query(sql, function(err, rows, results) {
            for(i=0;i<rows.length;i++) {
                date = rows[i].dob.toString().split(" ");
                rows[i].dob = [date[1], date[2], date[3]].join(" ");
                console.log(rows[i].dob);
            }
            res.render('policePoliceReport', { police: rows });
        });
    });

    app.get('/police/prisonReport',(req,res) => {
        message = '';
        var sql = "SELECT * FROM `Prison`";
        db.query(sql, function(err, rows, results) {
            res.render('policePrisonReport', { prisons: rows });
        });
    });

    app.get('/police/policeStationReport', (req,res) => {
        message = '';
        var sql = "SELECT * FROM `Police_Station`";
        db.query(sql, function(err, rows, results) {
            res.render('citizenPoliceStationList', { policestations: rows });
        });
    });
    
    //Crime category Report
    
    app.get('/police/crimeCategoryReport', (req,res) => {
        message = '';
        var sql = "SELECT * FROM `Crime_Category`";
        db.query(sql, function(err, rows, results) {
            res.render('policeCrimeCategoryReport', { crime: rows });
        });
    });

    app.get('/police/viewCirculars',(req,res) => {
        message = '';
        var sql = "SELECT * FROM `Article`";
        db.query(sql, function(err, rows, results) {
            res.render('policeViewCircular', { circulars: rows, message: message1 });
            message1 = '';
        });
    });
    
    app.get('/police/viewCirculars/delete/:article_id', (req,res) => {
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

            res.redirect('/police/viewCirculars');
        });
    });

    //Crime Report
    app.get('/police/crimeReport', (req,res) => {
        message = '';
        var sql = "SELECT A.id, C.name, A.category, D.court_name, A.date, A.description, A.place, A.photo_file FROM Crime A, Crime_Criminal B, Criminal C, Court D where A.id=B.crime_id AND B.criminal_id = C.id AND D.id = A.court_id";
        db.query(sql, function(err, rows, results) {
            for(i=0;i<rows.length;i++) {
                date = rows[i].date.toString().split(" ");
                rows[i].date = [date[1], date[2], date[3]].join(" ");
                console.log(rows[i].date);
            }
            res.render('policeCrimeReport', { crime: rows, message: message1 });
            message1 = '';          
        });
    });

    app.get('/police/crimeReport/delete/:id', (req,res) => {
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

            res.redirect('/police/crimeReport');
        });
    });

    app.get('/police/crimeReport/edit/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql1 =  "SELECT A.name FROM Criminal A, Crime B, Crime_Criminal C WHERE A.id=C.criminal_id AND C.crime_id=" + id + "";
        db.query(sql1, function(err,rows,results) {
            var criminal_name = rows[0].name;
            var sql = "SELECT A.id, A.category, A.court_id, B.court_name, A.date, A.description, A.place FROM Court B, Crime A WHERE B.id = A.court_id AND A.id = " + id + ";SELECT * FROM Court;SELECT * FROM Crime_Category;SELECT * FROM Criminal";
            db.query(sql, function(err, rows, results) {
                res.render('policeCrimeReportEdit', { crimes: rows[0], courts: rows[1], categories:rows[2], criminals: rows[3], criminalname: criminal_name })
            });      
        });  
    });

    app.post('/police/crimeReport/edit/:id',urlencodedParser,(req,res) => { 
        message = '';
        var id = req.params.id;
        if(req.method == 'POST') {
            var post = req.body;
            var criminal_id = post.criminal;
            var category = post.category;
            var court = post.court;
            var date = post.date;
            var description = post.description;
            var place = post.place;
            var sql = "UPDATE `Crime` SET `category` = '" + category + "',`court_id` = " + court + ",`date` = '" + date + "',`description` = '" + description + "',`place` = '" + place + "'  WHERE id = " + id + ";UPDATE `Crime_Criminal` SET `criminal_id` = " + criminal_id + " WHERE crime_id = " + id + "";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message1 = '';
                    throw err;
                }
                else {
                  message1 = 'Crime record has been updated';
                }
                res.redirect('/police/crimeReport');
             });
        }
        else {
            res.redirect('/police/crimeReport/edit/'+id);
        }
    });

    //Criminal Report
    app.get('/police/criminalReport', (req,res) => {
        message = '';
        var sql = "SELECT A.id, A.name, A.phone, A.height, A.weight, B.name AS prison, A.email, A.dob, A.address, A.city, A.state, A.country, A.photo_file FROM Criminal A, Prison B where A.prison_id = B.id";
        db.query(sql, function(err, rows, results) {
            for(i=0;i<rows.length;i++) {
                date = rows[i].dob.toString().split(" ");
                rows[i].dob = [date[1], date[2], date[3]].join(" ");
                console.log(rows[i].dob);
            }
            res.render('policeCriminalReport', { criminal: rows, message: message1 })
            message1 = '';
        });
    });

    app.get('/police/criminalReport/delete/:id', (req,res) => {
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
            res.redirect('/police/criminalReport');
        });
    });

    app.get('/police/criminalReport/edit/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql1 = "SELECT P.name FROM Criminal C,Prison P WHERE C.prison_id=P.id AND C.id="+id+"";
        db.query(sql1,function(err,rows,results) {
            var imprisoned_at = rows[0].name;
            var sql = "SELECT A.id, A.name, A.phone, A.height, A.weight, B.name AS prison, A.email, A.dob, A.address, A.city, A.state, A.country, A.photo_file FROM Criminal A, Prison B where A.prison_id = B.id AND A.id = " + id + ";SELECT * FROM Prison";
            db.query(sql, function(err, rows, results) {
                res.render('policeCriminalReportEdit', { criminals: rows[0], prisons: rows[1], imprisoned: imprisoned_at })
            });
        });  
    });

    app.post('/police/criminalReport/edit/:id',urlencodedParser,(req,res) => { 
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
            var sql = "UPDATE `Criminal` SET `name` = '" + name + "',`height` = " + height + ",`weight` = '" + weight + "',`prison_id` = '" + prison + "',`phone` = '" + phone + "',`email` = '" + email + "',`dob` = '" + dob + "',`address` = '" + address + "',`city` = '" + city + "',`state` = '" + state + "',`country` = '" + country + "' WHERE id = " + id + "";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message1 = '';
                    throw err;
                }
                else {
                  message1 = 'Criminal record has been updated';
                }
                res.redirect('/police/criminalReport');
             });
        }
        else {
            res.redirect('/police/criminalReport/edit/'+id);
        }
    });

    //Court Report
    app.get('/police/courtReport', (req,res) => {
        message = '';
        var sql = "SELECT * FROM Court";
        db.query(sql, function(err, rows, results) {
            res.render('policeCourtReport', { court: rows })
        });
    });

    // Complaints
    app.get('/police/viewComplaints', (req,res) => {
        message = '';
        var sql = "SELECT C.username,C.id,C.type,C.title,C.address,C.details,C.status,P.name from `Complaint` C, `Police_Station` P WHERE P.id = C.police_station_id";
        db.query(sql, function(err, rows, results) {
            res.render('policeViewComplaints', { complaints: rows, message: message1 });
            message1='';
        });
    });

    app.get('/police/viewComplaints/delete/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql = "DELETE FROM `Complaint` WHERE id = " + id + "";
        var query = db.query(sql, function(err, result) {
            if (err) {
                message1 = '';
                throw err;
            }
            else {
                message1 = 'Record deleted.'
            }
            res.redirect('/police/viewComplaints');
        });
    });

    app.get('/police/viewComplaints/edit/:id', (req,res) => {
        message = '';
        var id = req.params.id;
        var sql = "SELECT * from `Complaint` WHERE id = " + id + ";SELECT * FROM Police_Station";
        db.query(sql, function(err, rows, results) {
            res.render('policeViewComplaintsEdit', { complaints: rows[0], policestations: rows[1] });
        });        
    });

    app.post('/police/viewComplaints/edit/:id',urlencodedParser,(req,res) => { 
        message = '';
        var id = req.params.id;
        if(req.method == 'POST') {
            var post = req.body;
            var type = post.type;
            var title = post.title;
            var police_station_id = post.policeStation;
            var address = post.address;
            var status = post.status;
            var details = post.details;
            var sql = "UPDATE `Complaint` SET `type` = '" + type + "',`title` = '" + title + "',`status` = '" + status + "',`police_station_id` = '" + police_station_id + "',`address` = '" + address + "',`details` = '" + details + "' WHERE id = " + id + "";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message1 = '';
                    throw err;
                }
                else {
                  message1 = 'Complaints record has been updated';
                }
                res.redirect('/police/viewComplaints');
             });
        }
        else {
            res.redirect('/police/viewComplaints/edit/'+id);
        }
    });

};