"use strict";

var express = require('express');
var path    = require('path');
var mysql   = require('mysql');
var config 	= require(path.join(__dirname + '/../config.js'));
// var globe = require('./helpers/globe.js');

var app = express();
app.use('/views',express.static(__dirname + '/views'));

/* Avoid CROSS Origin request */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var findInfoById = function (index, callback) {
  // Perform database query that calls callback when it's done
  // This is our SpaceLocation database
  var SpaceLocation = {};
  if (!SpaceLocation[index])
    return callback(new Error(
      'No id matching '
       + index
      )
    );
  return callback(null, SpaceLocation[index]);
};

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get('/:id', function (req, res) {
  var index = req.params.id;
  findInfoById(index, function(error, location) {
    if (error) { /* Get Error and display it */}

    //TODO: Fill index file with data object location
    res.sendFile(path.join(__dirname+'/views/index.html'));
  });
});

var connection = mysql.createConnection(config.dbinfo);

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Space Location app listening at http://%s:%s', host, port);
});
