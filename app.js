var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var configstore = require('configstore');
var validate = require("./logic/validate");

app.set("view engine", "ejs");
app.use("/", express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));

const store = new configstore("Pr-Summariz");

app.get('/', function (req, res) {
    res.render("index");
});

app.post('/prinfo', function (req, res) {
    store.set('url',req.body.url);
    res.send('URL Loaded');
});

app.get('/prinfo',function(req,res){
    var url = store.get('url');
    res.render('prinfo',{url:url});
});

app.get('/prrules',function(req,res){
    res.render('prrules');
});

app.post('/prrules',function(req,res){
    var prrule = req.body.prrule;
    var cmrule = req.body.cmrule;
    store.set('prrule',prrule);
    store.set('cmrule',cmrule);
    res.redirect('/');
});

app.post('/prinfo/validate',(req,res)=>{
    var data = validate(store.get('prrule'),store.get('cmrule'),req.body.data);
    res.json(data);
})

app.listen(3000, function (req, res) {
    console.log("Server Started");
});