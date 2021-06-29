var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var message = -1;
module.exports = app => {
    app.get('/citDashboard/:username',(req,res) => {
        res.render('citizenDashboard', { message: message });
        username=req.params.username;
    });

    app.get('/citizen/logComplaint',(req,res) => {
        var sql = "SELECT * FROM `Police_Station`";
        db.query(sql, function(err,results) {
            res.render('citizenLogComplaint', { dropdownVals: results })
        });
    });


    app.post('/citizen/logComplaint',urlencodedParser,(req,res) => {
        var message = '';
        if(req.method == 'POST') {
            var post = req.body;
            var type = post.type;
            var title = post.title;
            var policeStationId = post.policeStation;
            var address = post.address;
            var details = post.details;
            var status = 'Submitted';

            var sql = "INSERT INTO `Complaint` (`username`,`type`,`title`,`police_station_id`,`address`,`details`,`status`) VALUES ( '" + username + "', '" + type + "', '" + title + "', '" + policeStationId+ "', '" + address + "', '" + details + "', '" + status + "')";
            var query = db.query(sql, function(err, result) {
                if (err) {
                    message = '0';
                    throw err;
                }
                else {
                  message = '1';
                }
                res.redirect('/citDashboard/'+username);
             });
        }
        else {
            res.redirect('/citizen/logComplaint');
        }
    });

    app.get('/citizen/complaintList', (req,res) => {
        var sql = "SELECT username,type,title,P.name,address,details,status from `Complaint` C, `Police_Station` P WHERE P.id = C.police_station_id AND username = '" + username + "'";
        db.query(sql, function(err,results) {
            res.render('citizenComplaintList', { complaints: results })
        });
        //res.render('citizenComplaintList');
    });

    app.get('/citizen/policeStationList', (req,res) => {
        var sql = "SELECT * from `Police_Station`";
        db.query(sql, function(err,results) {
            res.render('citizenPoliceStationList', { policestations: results })
        });
    });

};