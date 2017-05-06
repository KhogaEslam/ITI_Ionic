const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');

const url = "mongodb://localhost:27017/chatdb";

var db = null;

//Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]
var publicMessages = [];
var retPublicChat = [];

app.use('/node_modules',express.static(__dirname + '/node_modules'));
app.use(bodyParser.json())

MongoClient.connect(url, function(err, dbc) {
    if(err) {
        console.log("Couldn't connect to mongodb", err);
    }
    else {
        console.log("Connected successfully");
        db = dbc;
        server.listen(8080);

        /*Just for testing*/
        // savePublicChat({'username' : 'username1', 'msgContent' : 'msgContent1', 'msgTime' : 'msgTime1'});
        // savePublicChat({'username' : 'username2', 'msgContent' : 'msgContent2', 'msgTime' : 'msgTime2'});
        // savePublicChat({'username' : 'username3', 'msgContent' : 'msgContent3', 'msgTime' : 'msgTime3'});
        //
        //
        // publicMessages.push({'username' : 'username4', 'msgContent' : 'msgContent4', 'msgTime' : 'msgTime4'});
        // publicMessages.push({'username' : 'username5', 'msgContent' : 'msgContent5', 'msgTime' : 'msgTime5'});
        // publicMessages.push({'username' : 'username6', 'msgContent' : 'msgContent6', 'msgTime' : 'msgTime6'});
        // saveBulkPublicChat();
    }
})

/**
 *
 */

function buildAndCondition(username, secondArgument, email) {
    var where = "username == " + username;
    if(email) {
        where += " || email == " + secondArgument;
    }
    else {
        where += " && password == " + secondArgument;
    }
}

/**
 * Checks if user already registered in our database
 * @params: username, password, email (optional)
 * @return: boolean (true for registered, false for unregistered)
 */

function userAlreadyExist(username, password, email = false) {
    var condition = buildAndCondition(username, password, email);
    db.collection('users').find({})
}

/******************************************************************************/
/*
* Save One Public Message
*/
function savePublicChat(msg){
  console.log('save one');
  db.collection('publicChat').insertOne(msg)
  .then(function(result) {
    // process result
    //console.log(result);
  });
}

/******************************************************************************/
/*
* save Bulck array of Messages
*/
function saveBulkPublicChat(){
  console.log('save bulk');
  db.collection('publicChat').insertMany(publicMessages)
  .then(function(result) {
    // process result
    //console.log(result);
  });
}

/******************************************************************************/
/*
* get all chat messages
*/
var getBulkPublicChat = function(db, callback) {
  console.log('get bulck');
   var cursor = db.collection('publicChat').find();
   cursor.each(function(err, chat) {
      assert.equal(err, null);
      if (chat != null) {
         retPublicChat.push(chat);
      } else {
         callback();
      }
   });
};
/*
to use:
*/

app.post('/api/getall',function(request, response){
    console.log("NODE getall");
      getBulkPublicChat(db, function() {
          //db.close();
          response.send(retPublicChat);
      });
});
