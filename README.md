# Exercise Tracker REST API

#### A microservice project, part of Free Code Camp's curriculum
  Exercise Tracker Microservice app that is built on the Glitch platform using Node.js, Express.js, Mongodb and Mongoose.

## Project 4 of 5 for [freeCodeCamp](https://www.freecodecamp.com) Api and Microservices Developer Certification.

App Webpage: [Exercise Tracker REST API](https://fcc-exercisetracker-restapi.glitch.me/ "Exercise Tracker") 

Glitch Project: [Exercise Tracker REST API Glitch Project](https://glitch.com/~fcc-exercisetracker-restapi)
 
Completed API and Microservices Certification: [Certificate](https://www.freecodecamp.org/certification/carlitos/apis-and-microservices "FreeCodeCamp.Com").

FreeCodeCamp Public Profile: [Carlos Martinez FreeCodeCamp](https://www.freecodecamp.org/carlitos)

## Technologies Used:
> * HTML, JavaScript, CSS, Node.js, Express.js, MongoDB and Mongoose.   


## Some requirements to complete project:

1. Create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. Get an array of all users by getting api/exercise/users with the same info as when creating a user.
3. Add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will the the user object with also with the exercise fields added.
4. Can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
5. Can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)



#### Usage Examples:

GET `https://fcc-exercisetracker-restapi.glitch.me/api/exercise/users`

Will show existing users.



.........................................



GET `https://fcc-exercisetracker-restapi.glitch.me/api/exercise/log?userId=id`

Will show user information for user with userId=id.
