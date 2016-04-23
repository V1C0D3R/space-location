# Space Location Endpoints

### Display 'Hello World!'
**GET** _/sayHello_  

EXAMPLE:  
Request:  

    GET /sayHello

Response:  

    Hello World!


### Create new space location
**GET** _/newlocation_

Request:

	GET /newlocation?**ref**=[earth/moon/mars/sun]&**timestamp**=[time UTC]&...

Response:

	JSON object containing result links

