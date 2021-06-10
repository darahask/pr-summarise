// All Dependencies of the App
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var configstore = require('configstore');
var validate = require('./logic/validate');
var axios = require('axios');
var similarity = require('./logic/similarity');
var cors = require('cors');

// Configuring the server(view-engine,rootpath,request-parser)
app.set('view engine', 'ejs');
app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Storage mechanism(cache)
const store = new configstore('Pr-Summariz');

//Routes
app.get('/', function (req, res) {
  res.render('index');
});

//Routes corresponding to Pull-Request Info page
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

app.post('/prinfo/validate', (req, res) => {
  var data = validate(store.get('prrule'), req.body.data);
  res.json(data);
});

app.post('/prinfo/similarity', (req, res) => {
  var data = similarity(store.get('prrule'), req.body.data);
  res.json(data);
});

app.get('/prinfo/code', (req, res) => {
  res.render('codeinfo');
});

app.get('/prinfo/codeinfo', (req, res) => {
  var data = [];
  axios
    .get(store.get('url'))
    .then(function (resp) {
      var commits_url = resp['data']['commits_url'];
      axios
        .get(commits_url)
        .then(function (commits) {
          commits['data'].forEach((commit) => {
            axios
              .get(commit['url'])
              .then(function (files) {
                files['data']['files'].forEach((file) => {
                  data.push({ patch: file['patch'], name: file['filename'] });
                });
                res.json(data);
              })
              .catch(() => {});
          });
        })
        .catch(() => {});
    })
    .catch(() => {});
});

app.get('/prinfo/pkgcheck', (req, res) => {
  var promArr = [];
  var urls = store.get('pkgrule').split('\r\n');
  urls.forEach((url) => {
    if (url === '') {
      return;
    }
    var baseurl = `https://raw.githubusercontent.com/${store.get(
      'reponame'
    )}/${url}`;
    var headurl = `https://raw.githubusercontent.com/${store.get(
      'fullname'
    )}/${url}`;
    promArr.push(axios.get(baseurl));
    promArr.push(axios.get(headurl));
  });
  Promise.all(promArr).then(function (values) {
    var codedata = [];
    for (var i = 0; i < values.length; i = i + 2) {
      var data = {};
      data.validation = validate(values[i].data, { body: values[i + 1].data });
      data.similarity = similarity(values[i].data, {
        body: values[i + 1].data,
      });
      data.path = values[i + 1].request.path;
      codedata.push(data);
    }
    res.json(codedata);
  });
});

//Routes corresponding to storage of rules
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

//Listening on port of localmachine on (localhost:3000)
if (process.env.PORT) {
  app.listen(process.env.PORT, process.env.IP);
} else {
  app.listen(3000);
}
