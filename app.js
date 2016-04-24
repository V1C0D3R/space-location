"use strict";

var fs      = require('fs');
var express = require('express');
var path    = require('path');
var dotenv  = require('dotenv').config();
var config  = require(path.join(__dirname, 'config.js'));
var dao     = require(path.join(__dirname, 'dao','dao.js'));
var cheerio = require('cheerio');
var planetsJson = require(path.join(__dirname, "Database/planets.json"));

var bodyParser = require('body-parser');
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

var submitNewLocation = function (location, callback) {
  // Perform database query that calls callback when it's done
  // This is our SpaceLocation database
  dao.insertNewLocation(location, function(id) {
    if (!id) {
      return callback(new Error('Failed to submit new location'), null);
    }
    return callback(null, id);
  });
  
};

var createAndSendAddPlanetScript = function(response, planets, spaceLocation) {
  console.log("CREATE PLANET SCRIPT");
  var jsScript = "<script>function addPlanets(scene) {"
  //console.log(planetsJson);

  for (var planet in planetsJson) {
    var planetLat = planets[planet].latitude; // de -90 à 90
    var planetLong = planets[planet].longitude - 180; // de 0 à 360 -> -180 à 180
    var planetDistance = planets[planet].distanceToSun * 1495.978707; //* 149597.8707; // (UA = 149597870700 mètres) / 1000 / 1000
    var planetXPos = (planetDistance * Math.cos(planetLong) * Math.cos(planetLat));
    var planetYPos = planetDistance * Math.sin(planetLong) * Math.cos(planetLat);
    var planetZPos = planetDistance * Math.sin(planetLat);
    /*console.log(planet);
    console.log("Lat: " + planetLat);
    console.log("Long: " + planetLong);
    console.log("Dist: " + planetDistance);
    console.log("Position x: " + planetXPos);
    console.log("Position y: " + planetYPos);
    console.log("Position z: " + planetZPos);*/
    
    jsScript += "var planet" + planet + " = BABYLON.Mesh.CreateSphere('" + planet + "', 16, " + (planetsJson[planet].diameter / 1000) + ", scene);";
    jsScript += "planet" + planet + ".position = new BABYLON.Vector3(" + planetXPos + ", " + planetYPos + ", " + planetZPos + ");";
    jsScript += "var planetMaterial = new BABYLON.StandardMaterial('" + planet + "Material', scene);";
    jsScript += "planetMaterial.diffuseTexture = new BABYLON.Texture('" + planetsJson[planet].texturePath + "', scene);";
    jsScript += "planetMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);";
    jsScript += "planetMaterial.emissiveColor = BABYLON.Color3.White();";
  };
  
  if (spaceLocation) {
    console.log(spaceLocation);
  } else {
    console.log("no space loc");
  }
  var planetLat = planets["mars"].latitude; // de -90 à 90
  var planetLong = planets["mars"].longitude - 180; // de 0 à 360 -> -180 à 180
  var planetDistance = planets["mars"].distanceToSun * 1495.978707; //* 149597.8707; // (UA = 149597870700 mètres) / 1000 / 1000
  var planetXPos = (planetDistance * Math.cos(planetLong) * Math.cos(planetLat));
  var planetYPos = planetDistance * Math.sin(planetLong) * Math.cos(planetLat);
  var planetZPos = planetDistance * Math.sin(planetLat);
  jsScript += "var alpha = 0;";
  jsScript += "var beta = 0;";
  jsScript += "var altitude = 1500;";
  jsScript += "var cameraTarget = new BABYLON.Vector3(" + planetXPos + ", " + planetYPos + ", " + planetZPos + ");";
  jsScript += "camera = new BABYLON.ArcRotateCamera(\"Camera\", alpha, beta, altitude, cameraTarget, scene);";
  jsScript += "camera.attachControl(canvas, false);";

  jsScript += "var light = new BABYLON.PointLight(\"Omni\", new BABYLON.Vector3(0, 0, 0), scene);";
  jsScript += "var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);";

  jsScript += "godrays.mesh.material.diffuseTexture = new BABYLON.Texture('../views/images/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);";
  jsScript += "godrays.mesh.material.diffuseTexture.hasAlpha = true;";
  jsScript += "godrays.mesh.position = new BABYLON.Vector3(0, 0, 0);";
  jsScript += "godrays.mesh.scaling = new BABYLON.Vector3(695.7, 695.7, 695.7);";

  jsScript += "light.position = godrays.mesh.position;";

  jsScript += "};</script>";
  
  var html = fs.readFileSync(__dirname + '/views/index.html');
  var $ = cheerio.load(html);
  var scriptNode = $('#addPlanets');
  scriptNode.replaceWith(jsScript);
  response.send($.html());
};


app.get('/', function (req, res) {
  console.log("Called /");
  dao.getPlanetLocation(new Date(), function(planets) {
      if (!planets) {
        console.log("Planets not found");
        return;
      }
      createAndSendAddPlanetScript(res, planets, null);
    });
});

app.get('/location/:id', function (req, res) {
  console.log("Called /location/id");
  var index = req.params.id;
  findInfoById(index, function(error, location) {
    if (error) { 
      console.log("Error retrieving space location. Displaying todays planet without space location.");
      dao.getPlanetLocation(new Date(), function(planets) {
        if (!planets) {
          console.log("Planets not found");
          return;
        }
      
        createAndSendAddPlanetScript(res, planets, null);
        // TODO Saying problem retrieving location
      });
    } else {
        dao.getPlanetLocation(location.date, function(planets) {
        if (!planets) {
          console.log("Planets not found");
          return;
        }
        console.log(location);
        createAndSendAddPlanetScript(res, planets, location);
        // TODO add pins in WebGL for tweet location
      });
    }
  });
});

app.get('/newlocation/', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/newlocation.html'));
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
// parse application/json
app.use(bodyParser.json());

app.post('/api/addnewlocation', function (req, res) {
  // var coordinateSystem = req.data.coordinateSystem;
  // var planet = req.data.planet;
  // var longitude = req.data.longitude;
  // var latitude = req.data.latitude;
  // var altitude = req.data.altitude;

  console.log("Successfully received query !");
  console.log(req.body);

  var newLocation = req.body;
  
  var index = null;
  var url = "https://spacelocation.herokuapp.com/";
  submitNewLocation(newLocation, function(error, id) {
    if (error) { 
      console.log("Error submitting space location.");
      //TODO: return error to page : error
      error = "Error submitting space location.";
    } else {
        index = id;
        url += id;
    }
  });


  res.format({
    'text/plain': function(){
      res.send('id is ' + 1 + '.');
    },

    'text/html': function(){
      res.send('<p>id is ' + 1 + '</p>'); /// CHANGE WITH URL and <a>
    },

    'application/json': function(){
      res.send({ id: 1, url: url }); //ENTER RIGHT ID
    },

    'default': function() {
      // log the request and respond with 406
      res.status(406).send('Not Acceptable');
    }
  });
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Space Location app listening at http://%s:%s', host, port);
});
