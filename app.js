"use strict";

var express       = require('express');
var path          = require('path');
var dotenv        = require('dotenv').config();
var config 	      = require(path.join(__dirname, 'config.js'));
var dao           = require(path.join(__dirname, 'dao','dao.js'));

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
  dao.getSpaceLocationFromDB(index, function(location) {
    if (!location) {
      return callback(new Error('No id matching '+ index), null);
    }
    return callback(null, location);
  });
  
};


app.get('/', function (req, res) {
  dao.getPlanetLocation(new Date(), function(planets) {
      if (!planets) {
        console.log("Planets not found");
        return;
      }
      // TODO modify page with positions of planets
      res.sendFile(path.join(__dirname+'/views/index.html'));
    });
});

app.get('/:id', function (req, res) {
  var index = req.params.id;
  findInfoById(index, function(error, location) {
    if (error) { 
      console.log("Error retrieving space location. Displaying todays planet without space location.");
      dao.getPlanetLocation(new Date(), function(planets) {
      if (!planets) {
        console.log("Planets not found");
        return;
      }
      // TODO modify page with positions of planets
      // TODO Saying problem retrieving location
      res.sendFile(path.join(__dirname+'/views/index.html'));
    });
    } else {
        dao.getPlanetLocation(location.date, function(planets) {
        if (!planets) {
          console.log("Planets not found");
          return;
        }
        // TODO modify page with positions of planets
        // TODO add pins in WebGL for tweet location
        res.sendFile(path.join(__dirname+'/views/index.html'));
      });
    }
  });
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Space Location app listening at http://%s:%s', host, port);
});
