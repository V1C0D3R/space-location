CREATE DATABASE SpaceTweeters;

CREATE USER 'space-user'@'localhost' IDENTIFIED BY 'space-password';

CREATE TABLE Planet (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
	 locationDate DATE NOT NULL,
	 distanceToSun FLOAT NOT NULL,
	 latitude FLOAT NOT NULL,
	 longitude FLOAT NOT NULL,
	 
     PRIMARY KEY (id)
);

CREATE TABLE EarthPosition (
	id INT NOT NULL AUTO_INCREMENT,
	latitude FLOAT NOT NULL,
	longitude FLOAT NOT NULL,
	altitude FLOAT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE SunPosition (
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id)
);

CREATE TABLE MarsPosition (
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id)
);

CREATE TABLE MoonPosition (
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (id)
);


CREATE TABLE SpaceLocation (
	id INT NOT NULL AUTO_INCREMENT,
	moment DATETIME NOT NULL,
	idEarthPosition INT NOT NULL,
	idSunPosition INT,
	idMarsPosition INT,
	idMoonPosition INT,
	
	PRIMARY KEY (id),
    FOREIGN KEY (idEarthPosition) REFERENCES EarthPosition(id) ON DELETE CASCADE,
	FOREIGN KEY (idSunPosition) REFERENCES SunPosition(id) ON DELETE CASCADE,
	FOREIGN KEY (idMarsPosition) REFERENCES MarsPosition(id) ON DELETE CASCADE,
	FOREIGN KEY (idMoonPosition) REFERENCES MoonPosition(id) ON DELETE CASCADE
);

CREATE TABLE Tweet (
	id INT NOT NULL AUTO_INCREMENT,
	person VARCHAR(200) NOT NULL,
	text VARCHAR(5000) NOT NULL,
	idLocation INT NOT NULL,
	
	PRIMARY KEY (id),
	FOREIGN KEY (idLocation) REFERENCES SpaceLocation(id) ON DELETE CASCADE
);
