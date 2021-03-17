var express = require('express');
var app = express();
var bodyparser = require('body-parser');

app.set("view engine", "ejs");
app.use("/", express.static('public'));
app.use(bodyparser.urlencoded({extended:false}));

app.get('/', function (req, res) {
    res.render("index");
});

var url = "";
app.post('/prinfo', function (req, res) {
    url = req.body.url;
    res.send('URL Loaded');
});

app.get('/prinfo',function(req,res){
    console.log(url);
    res.render('prinfo',{url:url});
})

app.listen(3000, function (req, res) {
    console.log("Server Started");
})