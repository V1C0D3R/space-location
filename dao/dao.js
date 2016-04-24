var mysql   = require('mysql');
var path    = require('path');
var config 	= require(path.join(__dirname, '..', 'config.js'));
var dateFormat = require('dateformat');

var dao = {};

var pool = mysql.createPool({
	connectionLimit : 100,
	host : config.dbhost,
	user : config.dbuser,
	password : config.dbpassword,
	database : config.dbname
});

dao.getSpaceLocationFromDB = function getSpaceLocationFromDB (id, callback) {
	if (isNaN(parseInt(id))) {
		console.log("id is not a number");
		return callback(null);
	}
	
	pool.getConnection(function(err, connection) {
		if (err) {
			if (connection) {
				connection.release();
			}
			console.log("Error getting SpaceLocation " + err);
		return callback(null);
		}
		
		console.log('Connected as id: ' + connection.threadId);
		// Careful with injection!
		connection.query("SELECT * FROM SpaceLocation sl, EarthPosition ep WHERE sl.id="+id + " AND sl.idEarthPosition=ep.id;", function(err, rows) {
			connection.release();
			if (err) {
				console.log("Error after select query: " + err);
		return callback(null);
			};
			if (rows.length == 0) {
				console.log("No row with id " + id + " found.");
		return callback(null);
			}
			spaceRow = rows[0];
			spaceLocation = {
				date: spaceRow['moment'],
				lat: spaceRow['latitude'],
				long: spaceRow['longitude'],
				altitude: spaceRow['altitude']
			};
			console.log("SPACE LOC FOUND");
			console.log(spaceLocation);
			return callback(spaceLocation);
		});
	});
};

dao.getPlanetLocation = function getPlanetLocation(date, callback) {
		pool.getConnection(function(err, connection) {
		if (err) {
			if (connection) {
				connection.release();
			}
			console.log("Error getting Planet " + err);
		return callback(null);
		}
		
		connection.query("SELECT * FROM Planet WHERE locationDate='"+ dateFormat(date, "yyyy-mm-dd") + "';", function(err, rows) {
			connection.release();
			if (err) {
				console.log("Error after select query: " + err);
				return callback(null);
			};
			if (rows.length != 8) {
				console.log("Not enough planets found: " + rows.length);
				return callback(null);
			}
			planets = {};
			pLen = rows.length;
			for (i = 0; i < pLen; i++) {
				row = rows[i];
				planets[row['name']] = {
					latitude: row['latitude'],
					longitude: row['longitude'],
					distanceToSun: row['distanceToSun']
				};
			}
			console.log(planets);
			return callback(planets);
		});
	});
};

dao.insertNewLocation = function insertNewLocation(newLocation, callback) {
	// newLocationExample {"coordinateSystem":"ecliptic","planet":"earth","longitude":"88","latitude":"88","altitude":"88"}

	// if (isNaN(newLocation.coordinateSystem) || isNaN(newLocation.planet) || isNaN(parseFloat(newLocation.longitude)) || isNaN(parseFloat(newLocation.latitude)) || isNaN(parseFloat(newLocation.altitude))) {
	// 	console.log("Missing a parameter, should be like : {\"coordinateSystem\":\"ecliptic\",\"planet\":\"earth\",\"longitude\":\"88\",\"latitude\":\"88\",\"altitude\":\"88\"}");
	// 	return callback(null);
	// }
	pool.getConnection(function(err, connection) {
		if (err) {
			if (connection) {
				connection.release();
			}
			console.log("Error setting new location: " + err);
			return callback(null);
		}
		
		var locationDate = dateFormat(new Date().getTime(), "yyyy-mm-dd hh:MM:ss");
		newLocation.date = locationDate;
		console.log("Location date : " + locationDate);

		// connection.query("SELECT * FROM Planet WHERE locationDate='"+ dateFormat(date, "yyyy-mm-dd hh:MM:ss") + "';", function(err, rows) {
		// 	connection.release();
		// 	if (err) {
		// 		console.log("Error after select query: " + err);
		// 		return callback(null);
		// 	};
		// 	if (rows.length != 8) {
		// 		console.log("Not enough planets found: " + rows.length);
		// 		return callback(null);
		// 	}
		// 	planets = {};
		// 	pLen = rows.length;
		// 	for (i = 0; i < pLen; i++) {
		// 		row = rows[i];
		// 		planets[row['name']] = {
		// 			latitude: row['latitude'],
		// 			longitude: row['longitude'],
		// 			distanceToSun: row['distanceToSun']
		// 		};
		// 	}
		// 	console.log(planets);
		// 	return callback(planets);
		// });
	});
};

module.exports = dao;
