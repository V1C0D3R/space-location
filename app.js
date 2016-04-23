"use strict";

var express = require('express');
var path    = require('path');
// var globe = require('./helpers/globe.js');

var app = express();
app.use('/views',express.static(__dirname + '/views'));

/* Avoid CROSS Origin request */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get('/getSearchUrls', function (req, res) {
	var searchQuery = req.query.q;
  // default google results is set to 10
	var num = req.query.num || 10;

	gCrawler.getGoogleResult(searchQuery, num, function (error, links) {
    // Return Objects array : {title:"", url:""}
	  res.contentType('application/json');
	  res.send(JSON.stringify(links));
	});
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Expert System Search app listening at http://%s:%s', host, port);
});
