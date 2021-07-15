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

};