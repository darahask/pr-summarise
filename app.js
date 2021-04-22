var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var configstore = require('configstore');
var validate = require("./logic/validate");
var axios = require('axios');
var similarity = require('./logic/similarity');

app.set("view engine", "ejs");
app.use("/", express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const store = new configstore("Pr-Summariz");

app.get('/', function (req, res) {
    res.render("index");
});

app.post('/prinfo', function (req, res) {
    store.set('url', req.body.url);
    store.set('fullname', req.body.fullname);
    store.set('reponame', req.body.reponame);
    res.send('URL Loaded');
});

app.get('/prinfo', function (req, res) {
    var url = store.get('url');
    res.render('prinfo', { url: url });
});

app.get('/prrules', function (req, res) {
    res.render('prrules');
});

app.post('/prrules', function (req, res) {
    var prrule = req.body.prrule;
    var cmrule = req.body.cmrule;
    store.set('prrule', prrule);
    store.set('pkgrule', cmrule);
    res.redirect('/');
});

app.post('/prinfo/validate', (req, res) => {
    var data = validate(store.get('prrule'), req.body.data);
    res.json(data);
})

app.post('/prinfo/similarity', (req, res) => {
    var data = similarity(store.get('prrule'), req.body.data);
    res.json(data);
})

app.get('/prinfo/code', (req, res) => {
    res.render('codeinfo');
});

app.get('/prinfo/codeinfo', (req, res) => {
    var data = [];
    axios.get(store.get('url')).then(function (resp) {
        var commits_url = resp['data']['commits_url'];
        axios.get(commits_url).then(function (commits) {
            commits['data'].forEach(commit => {
                axios.get(commit['url']).then(function (files) {
                    files['data']['files'].forEach(file => {
                        data.push({ patch: file['patch'], name: file['filename'] })
                    });
                    res.json(data);
                }).catch(()=>{});
            });
        }).catch(()=>{});
    }).catch(()=>{});
})

app.get("/prinfo/pkgcheck", (req, res) => {
    var codedata = [];
    var urls = store.get('pkgrule').split("\r\n");
    urls.forEach((url)=>{
        if(url === ''){
            return;
        }
        var baseurl = `https://raw.githubusercontent.com/${store.get('reponame')}${url}`;
        var headurl = `https://raw.githubusercontent.com/${store.get('fullname')}${url}`;
        axios.get(baseurl).then(function (resp) {
            var basefile = resp['data'].toString();
            axios.get(headurl).then(function (resp2) {
                var headfile = resp2['data'].toString();
                var data = {}
                data.validation = validate(headfile,{body:headfile});
                data.similarity = similarity(basefile,{body:headfile});
                data.path = url;
                codedata.push(data);
                store.set('codedata',codedata);
            }).catch(()=>{});
        }).catch(()=>{});
    })
    res.json(store.get('codedata'));
});

app.listen(3000, function (req, res) {
    console.log("Server Started");
});