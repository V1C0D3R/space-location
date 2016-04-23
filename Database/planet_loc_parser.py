import sys
from os import listdir
from os.path import isfile, join
from datetime import datetime, timedelta

def readFile(file):
	with open(file, 'r') as f:
		content = f.readlines()
	return content

def get_sql(planetname, line):
	splitted_line = line.split()
	if len(splitted_line) != 5:
		print("Line doesn't contain 5 elements")
		return None
	year = int(splitted_line[0])
	doy = int(splitted_line[1])
	date = datetime(year, 1, 1) + timedelta(doy - 1)
	
	dist_to_sun = float(splitted_line[2])
	lat = float(splitted_line[3])
	long = float(splitted_line[4])
	
	return "('{0}', '{1}', {2}, {3}, {4})".format(planetname, date.strftime("%Y-%m-%d"), dist_to_sun, lat, long)


files = [f for f in listdir(".") if f.endswith('.lst')]
print("INSERT INTO Planet (name, locationDate, distanceToSun, latitude, longitude) VALUES ");
for file in files:
	planetname = file[:-4]
	lines = readFile(file)[1:]
	for line in lines:
		sql = get_sql(planetname, line)
		print(sql)
		print(",")
		
