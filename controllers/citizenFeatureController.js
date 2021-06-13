var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = app => {
    app.get('/citDashboard/:username',(req,res) => {
        res.render('citizenDashboard');
    });    
};