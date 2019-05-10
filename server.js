const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

//connect to mongodb using login info stored on the environment variable.
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true});
mongoose.set('useCreateIndex', true);


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//Create schemas for documents.
var Schema = mongoose.Schema;

//user document
var uSchema = new Schema({
    username:  {type:String, required:true},
});

var usernameModel = mongoose.model('usernameModel', uSchema);

var Schema = mongoose.Schema;

//subschema for the exercise log array
var seSchema = new Schema({
    description: String,
    duration: Number,
    date: String,
});

//schema for the user exercises document
var eSchema = new Schema({
    _id: String,
    username:  {type:String, required:true},
    count: Number,
    log: [seSchema],
  
});

var eModel = mongoose.model('eModel', eSchema);


//add new users to the api
app.post("/api/exercise/new-user",function(req, res, next) {
next();
}, function(req, res) {
  var uname = req.body.username;
  usernameModel.find({username:uname}, function(err, data) { 
      if(!err) {
                if(data.length>0)
                {
                    //Send a response indicating the the username is already taken.
                    res.json('USERNAME already taken.');
                }
                else
                {
                        //if the username is available, then we create a new user.
                        var newUser = new usernameModel({username: uname});
                        req.body._id = newUser._id;
                        console.log('exercise _id: '+newUser._id+' username: '+uname);
                        var newUserE = new eModel({_id: req.body._id, username: uname, count:0, log:[],});
                        //create the user document and also the user exercise document.
                        newUserE.save();
                        newUser.save();
                        res.json({username:uname, _id: newUser._id});
                }
                }
                else{
                      console.log('error');
                      return;
                }
          });
});


//get all the existing users.
app.get("/api/exercise/users",function(req, res, next) {
next();}, function(req, res) {
          usernameModel.find({}, function(err, data) { 
                if(!err) {
                      //return all the users or else return a message indicating there are no users.
                      if(data.length>0)
                      {
                        res.json(data);
                      }
                      else
                      {
                        res.json("There are no users.");
                      }
                }
                else{
                      console.log('error');
                }
          });
});


//Get exercise information for a given userId
app.get("/api/exercise/log",function(req, res, next) {
next();
}, function(req, res) {
          eModel.find({_id:req.query.userId}, function(err, data) { 
                if(!err) {
                      //if the user is found we proceed, if not then we notify that the userId does not exist.
                      if(data.length>0)
                      {
                        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                        var user = data[0];
                        var from = new Date('1901-01-01');
                        var to = new Date();
                        var obj = {
                          _id: user._id,
                          username: user.username
                        };
                        
                        //set the 'from' value if it is entered in the request
                        if(req.query.hasOwnProperty('from'))
                        {
                          var date = new Date(req.query.from);
                          if(date !== 'Invalid Date')
                          {
                            from = date;
                            obj.from = date.toLocaleDateString("en-US", options);
                          }
                        }
                        
                        
                        //set the 'to' value if it is entered in the request.
                        if(req.query.hasOwnProperty('to'))
                        {
                          var date = new Date(req.query.to);
                          if(date != 'Invalid Date')
                          {
                            to = date;
                            obj.to = date.toLocaleDateString("en-US", options);
                          }
                        }
                        
                        //set the original count
                        var count = user.log.length;
                        
                        //if req includes 'limit' then we assign it to count
                        if(req.query.hasOwnProperty('limit'))
                        {
                           count = req.query.limit;
                        }
                        
                        obj.count = parseInt(count);
                        
                        //initialize array for the exercise logs to be shown.
                        var logs = [];
                        
                        
                        //depending on the req from, to, and limit, only those logs will be shown.
                        for(let i =0; i<user.log.length; i++)
                        {
                          var e = user.log[i];
                          var edate = new Date(e.date);
                          if(edate > from && edate<= to)
                          {
                            logs.push(e);
                            count--;
                            if(count==0)
                            {
                              break;
                            }
                          }
                        }
                        
                        //add the logs to the object.
                        obj.log = logs;
                         
                        //output the logs of that userId with the parameters given on request.
                        res.json(obj);
                      }
                      else
                      {
                        //if there are not users with that userId, then we send the message.
                        res.send("There are no users with userId: "+req.query.userId);
                      }
                }
                else{
                      console.log('error');
                }
          });
});



//add an exercise to the user exercise document
app.post("/api/exercise/add",function(req, res, next) {
next();
}, function(req, res) {

          var uId = req.body.userId;
          var des = req.body.description;
          var du = req.body.duration;
          var date = req.body.date;
          
          //make sure that the mandatory fields are submitted by user(userId, description, duration)
          if(uId=='')
          {
            res.send('Please provide a userId');
          }
          else if(des=='')
          {
            res.send('Please provide a description');
          }
          else if(du=='')
          {
            res.send('Please provide a duration value');
          }
          else if(date!==''&& new Date(date)=='Invalid Date')
          {
                res.send('Please enter a valid date format(YYYY-MM-DD)');
          }
          else
          {
            var d;
            if(date=='')
            {
              //if no date is entered then we use current date.
              d = new Date();
            }
            else
            {
              d = new Date(date);
            }
            
            //now we search for the userId
            eModel.find({_id:uId}, function(err, data) { 
                  if(!err) {
                        //if the userId is found, we proceed to add the exercise.
                        if(data.length>0)
                        {
                            var user = data[0];
                            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                            var obj = {
                                description: des,
                                duration: du,
                                date: d.toLocaleDateString("en-US", options)
                            };
                          
                          //we retrieve the current exercise log
                          var oldlog = user.log;
                          //we push the new exercise to the array
                          oldlog.push(obj);
                          
                          //now we update the user exercise document 
                          eModel.updateOne({_id:uId},{log:oldlog}, function(err, raw) {
                                            if(err) {
                                                  console.log('error: '+err);
                                            }
                                            else
                                            {
                                              console.log('successfull exercise add');
                                            }
                                          });
                          //we return the information of the newly added exercise
                          res.json({
                            username: user.username, 
                            description: obj.description, 
                            duration: obj.duration,
                            _id: user._id,
                            date: obj.date
                          });
                        }
                        else
                        {
                          // if no users are found with that userId
                          res.send('no user found with that userId');
                        }
                  }
                  else{
                        console.log('error');
                  }
            });
          }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found 223'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
}) 