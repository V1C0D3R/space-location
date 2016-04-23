var config = {};

//You can change your port number here
config.port = process.env.PORT || 3000;

config.dbinfo = process.env.CLEARDB_DATABASE_URL || "mysql://space-user:space-password@localhost";

module.exports = config;
