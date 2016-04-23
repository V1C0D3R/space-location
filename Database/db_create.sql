CREATE TABLE planet_location (
     id INT NOT NULL AUTO_INCREMENT,
     name CHAR(100) NOT NULL,
	 location_date DATE NOT NULL,
	 distance_to_sun FLOAT NOT NULL,
	 lat FLOAT NOT NULL,
	 long FLOAT NOT NULL,
	 
     PRIMARY KEY (id)
);
