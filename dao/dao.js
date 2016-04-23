var mysql   = require('mysql');
var path    = require('path');
var config 	= require(path.join(__dirname, '..', 'config.js'));

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
			console.log(spaceLocation);
			return callback(spaceLocation);
		});
	});
};

module.exports = dao;
