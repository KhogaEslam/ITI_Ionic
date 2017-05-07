const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');

const tableSeperator = "LDBDwfZ1IqecOHJrj2z1";

const url = "mongodb://localhost:27017/chatdb";

var db = null;

//Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]
var publicMessages = [];
var activeUsers = {
    "kfdnkndfkndffd": "dfknfdkndkfndf"
};
var retPublicChat = [];

app.all('*',function(req,res,next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();

})

app.use('/node_modules',express.static(__dirname + '/node_modules'));
app.use('/public',express.static(__dirname + '/public'));
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



function loginCheck(username, password) {
    return this.username == username && this.password == password;
}

function registrationCheck(username, email) {
    return this.username == username || this.password == password;
}


/**
 * Checks if user already registered in our database
 * @param string, string (optional)
 * @return boolean (true for registered, false for unregistered)
 */

function userAlreadyExist(username, password = null) {
    var condition = {"username": username};
    if(password) {
        condition.password = password;
    }
    return db.collection('users').find(condition);
}

/**
 * Handles Login user
 */

app.post('/api/login', function(req, res) {
    var user = req.body;
    var promise = userAlreadyExist(user.username, user.password).toArray();
    promise.then(function(data) {
        if(data.length) {
            res.send({"code": 1, "status": "success", "message": "You're successfully logged in"});
        }
        else {
            res.send({"code": 2, "status": "failed", "message": "Invalid credintials"});
        }
    })
});

/**
 * Handles Registering user
 */

app.post('/api/register', function(req, res) {
    var user = req.body;
    var promise = userAlreadyExist(user.username, user.password).toArray();
    promise.then(function(data) {
        if(data.length) {
            console.log(data);
            res.send({"code": 2, "status": "failed", "message": "username already exists"});
        }
        else {
            db.collection('users').insertOne(user);
            res.send({"code": 1, "status": "seccess", "message": "You've beeen successfully registered"});
        }
    });
});

app.post('/api/active', function(req, res) {
    var users = [];
    var username = req.body.username;
    for(var key in activeUsers) {
        if(!activeUsers[key].socket && username != activeUsers[key] != username) {
            users.push(key);
        }
    }
    console.log(activeUsers);
    if(users.length) {
        res.send({"code": 5, "status": "success", "message": {"users": users}});
    }
    else {
        res.send({"code": 4, "status": "failed", "message": "No active users"});
    }
});

/**
 * Comparing to strings and returning the lexigraphically order
 * @param string, string
 * @return integer
 */

function cmp(username1, username2) {
    var n = Math.min(username1.length, username2.length);
    for(var i = 0; i < n; i++) {
        if(username1[i] < username2[i]) {
            return -1;
        }
        else if(username1[i] > username2[i]) {
            return 1;
        }
    }
    if(username1.length < username2.length)
        return -1;
    return 1;
}

/**
 * sorting usernames lexigraphically
 * @param array
 * @return array(sorted)
 */

function reOrderUsernames(users) {
    if(cmp(users[0], users[1]) == 1) {
        var tmp = users[0];
        users[0] = users[1];
        users[1] = tmp;
    }
    return users;
}


/**
 * Initiating socket connection
 */

io.on('connection', function(client) {

    /**
     * Registering user in system cache
     */

    client.on('logged', function(username) {
        activeUsers[username] = {"socketId": client.id};
        activeUsers[client.id] = {"username": username, "socket": true};
    });

    client.on('private_chat_initiated', function(username) {
        
    })

    /**
     * Sending private message to and from the two users
     */

    client.on('private_message', function(username, message) {
        var users = reOrderUsernames(activeUsers[client.id], username);
        db.collection(users[0] + tableSeperator + users[1]).insertOne({"msg": message, "msgDate": new Date()}, function(err, res) {
            io.of('/').to(activeUsers[username].socketId).emit(message);
            client.emit('msg_received', {"code": 3, "status": "success", "message": message});
        });

    });

    /**
     * Sending public message to and from the two users
     */

    client.on('public_message', function(username, message) {
        console.log(username, message);
        var msg = {'username' : username, 'msgContent' : message, 'msgTime' : new Date()};    
        savePublicChat(msg);
        publicMessages.push(msg);
        client.broadcast.emit('messages',publicMessages);
        client.emit('messages',publicMessages); 
    });

    client.on('logout', function(username) {
        delete activeUsers[client.id];
        delete activeUsers[username];
    });
})
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
      publicMessages = {};
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

app.post('/api/getall',function(request, response){
    console.log("NODE getall");
      getBulkPublicChat(db, function() {
          //db.close();
          response.send(retPublicChat);
      });
});
