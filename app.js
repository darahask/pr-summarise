var express = require('express');
var app = express();
var bodyparser = require('body-parser');

app.set("view engine", "ejs");
app.use("/", express.static('public'));
app.use(bodyparser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.render("index");
});

app.post('/pullreq', function (req, res) {
    var prurl = "";
    res.render('prinfo.ejs', { prurl: prurl });
});

app.listen(3000, function (req, res) {
    console.log("Server Started");
})