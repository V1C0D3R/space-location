var mysql   = require('mysql');
var path    = require('path');
var config 	= require(path.join(__dirname, 'config.js'));

var dao = {};

var pool = mysql.createPool({
	connectionLimit : 100,
	host : config.dbhost,
	user : config.dbuser,
	password : config.dbpassword,
	database : config.dbname
});

dao.getSpaceLocationFromDB = function getSpaceLocationFromDB (id) {
	if (isNaN(parseInt(id))) {
		console.log("id is not a number");
		return null;
	}
	
	pool.getConnection(function(err, connection) {
		if (err) {
			if (connection) {
				connection.release();
			}
			console.log("Error getting SpaceLocation " + err);
			return null;
		}
		
		console.log('Connected as id: ' + connection.threadId);
		// Careful with injection!
		connection.query("SELECT * FROM SpaceLocation WHERE id="+id, function(err, rows) {
			connection.release();
			if (err) {
				console.log("Error after select query: " + err);
				return null;
			};
			if (rows.length == 0) {
				console.log("No row with id " + id + " found.");
				return null;
			}
			console.log("Requested row: "+ rows[0]);
			return rows[0];
		});
	});
};

module.exports = dao;
