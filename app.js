"use strict";

var fs      = require('fs');
var express = require('express');
var path    = require('path');
var dotenv  = require('dotenv').config();
var config  = require(path.join(__dirname, 'config.js'));
var dao     = require(path.join(__dirname, 'dao','dao.js'));
var cheerio = require('cheerio');
var planetsJson = require("views/json/planets.json");

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

var createAndSendAddPlanetScript = function(response, planets) {
  var jsScript = "<script>var addParents = function(scene) {"
  
  planetsJson.forEach(function(planetJson) {
    var planet = planetJson.name;
    var planetLat = planets[planet].latitude; // de -90 à 90
    var planetLong = planets[planet].longitude - 180; // de 0 à 360 -> -180 à 180
    var planetDistance = planets[planet].distanceToSun * 149597.8707; // (UA = 149597870700 mètres) / 1000 / 1000
    var planetXPos = planetDistance * Math.cos(planetLong) * Math.cos(planetLat);
    var planetYPos = planetDistance * Math.sin(planetLong) * Math.cos(planetLat);
    var planetZPos = planetDistance * Math.sin(planetLat);
    
    jsScript += "var planet = BABYLON.Mesh.CreateSphere(" + planet + ", 16, " + planetJson.diameter + ", scene);";
    jsScript += "planet.position = new BABYLON.Vector3(" + planetXPos + ", " + planetYPos + ", " + planetZPos + ");";
    jsScript += "var planetMaterial = new BABYLON.StandardMaterial(" + planet + "Material, scene);";
    jsScript += "planetMaterial.diffuseTexture = new BABYLON.Texture('" + planetJson.texturePath + "', scene);";
    jsScript += "planetMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);";
    jsScript += "planetMaterial.emissiveColor = BABYLON.Color3.White();";
  });
    
  jsScript + "};";
  
  console.log(jsScript);  
  var html = fs.readFileSync(__dirname + '/views/index.html');
  var $ = cheerio.load(html);
  var scriptNode = $('addPlanets');
  scriptNode.replaceWith(jsScript);
  response.send($.html());
  
  /*
  for (var planet in planets) {
          var planetVarName = planet + "Pos = {};";
          
  }
  
  jsScript += "$.getJSON(\"views/json/planets.json\", function(planetsJson) {";
        jsScript += "planetsJson.forEach(function(planetJson) {";
        jsScript += 
        
        jsScript += "planetMaterial.diffuseTexture = new BABYLON.Texture('views/images/earth.jpg', scene);";
        jsScript += "planetMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);";
        jsScript += "planetMaterial.emissiveColor = BABYLON.Color3.White();";
            
        jsScript += "});"
  
        
          planetSizeJSVariables += "var " + planetVarName + ";";
          planetSizeJSVariables += planetVarName + ".x = " + planetXPos + ";";
          planetSizeJSVariables += planetVarName + ".y = " + planetYPos + ";";
          planetSizeJSVariables += planetVarName + ".z = " + planetZPos + ";";
        }
        planetSizeJSVariables += "</script>";
        console.log(planetSizeJSVariables);*/
        

};


app.get('/', function (req, res) {
  dao.getPlanetLocation(new Date(), function(planets) {
      if (!planets) {
        console.log("Planets not found");
        return;
      }
      createAndSendAddPlanetScript(res, planets);
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
      createAndSendAddPlanetScript(res, planets);
      // TODO Saying problem retrieving location
    });
    } else {
        dao.getPlanetLocation(location.date, function(planets) {
        if (!planets) {
          console.log("Planets not found");
          return;
        }
        createAndSendAddPlanetScript(res, planets);
        // TODO add pins in WebGL for tweet location
      });
    }
  });
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Space Location app listening at http://%s:%s', host, port);
});
