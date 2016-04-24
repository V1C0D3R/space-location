var config = {};

//You can change your port number here
config.port = process.env.PORT || 3000;

config.dbinfo = process.env.CLEARDB_DATABASE_URL || "mysql://space-user:space-password@localhost";	
config.dbhost = process.env.DBHOST || "host.com";
config.dbuser = process.env.DBUSER || "user";
config.dbpassword = process.env.DBPASSWORD || "password";
config.dbname = process.env.DBNAME || "dbname";

module.exports = config;
