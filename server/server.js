const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');
const ta = require('time-ago')();
const offlineUsers = {};

const tableSeperator = "LDBDwfZ1IqecOHJrj2z1";

const url = "mongodb://127.0.0.1:27017/chatdb";

var db = null;

//Array contains objects [{'username' : username, 'msgContent' : msgContent, 'msgTime' : msgTime}]
var publicMessages = [];
var activeUsers = {};
var retPublicChat = [];

var getBulkPublicChat = function(db, callback) {
  console.log('get bulck');
   var cursor = db.collection('publicChat').find();
   retPublicChat = [];
   cursor.each(function(err, chat) {
      assert.equal(err, null);
      if (chat != null) {
        chat.msgDate = ta.ago(chat.msgTime);
        retPublicChat.push(chat);
        // console.log("public chat", chat);
      } else {
         callback();
      }
   });
};


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
        getBulkPublicChat(db, function() {
            publicMessages = retPublicChat;
        });

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

/******************************************************************************/
/*
* get all chat messages
*/

app.post('/api/getall',function(request, response){
    console.log("NODE getall");
      getBulkPublicChat(db, function() {
          //db.close();
          response.send(retPublicChat);
      });
});

function loginCheck(username, password) {
    return this.username == username && this.password == password;
}

function registrationCheck(username, email) {
    return this.username == username || this.password == password;
}

function getActiveUsers(username) {
    var users = {};
    for(var key in activeUsers) {
        if(!activeUsers[key].socket) {
            console.log(key);
            users[key] = {};
            users[key].username = key;
            users[key].offline = offlineUsers[key];
        }
    }
    return users;
}

function getOnlineUsers(localActiveUsers) {
    console.log("Inside getOnlineUsersExceptClient");
    console.log("currentActiveUsers");
    console.log(JSON.stringify(localActiveUsers, null, 4));
    for(var user in localActiveUsers) {
        if(localActiveUsers[user].offline) {
            console.log(user, localActiveUsers[user].offline, "Offline");
            delete localActiveUsers[user];
        }
    }
    console.log("Before Returning");
    console.log(JSON.stringify(localActiveUsers, null, 4));
    return localActiveUsers;
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

function userAlreadyLogged(username) {
    return activeUsers[username] != undefined;
}

/**
 * Handles Login user
 */

app.post('/api/login', function(req, res) {
    var user = req.body;
    var promise = userAlreadyExist(user.username, user.password).toArray();
    if(userAlreadyLogged(user.username)) {
        res.send({"code":publicMessages, "status": "failed", "message": "User already logged in"})
    }
    else {
        promise.then(function(data) {
        if(data.length) {
            res.send({"code": 1, "status": "success", "message": "You're successfully logged in"});
        }
        else {
            res.send({"code": 2, "status": "failed", "message": "Invalid credintials"});
        }
    })
    }
    
});

/**
 * Handles Registering user
 */

app.post('/api/register', function(req, res) {
    var user = req.body;
    var promise = userAlreadyExist(user.username).toArray();
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
    console.log(JSON.stringify(activeUsers, null, 2))
    var users = [];
    var username = req.body.username;
    var users = getActiveUsers();
    console.log('/api/active', activeUsers);
    console.log("Object length:", Object.keys(users).length)
    if(Object.keys(users).length > 0) {
        res.send({"code": 5, "status": "success", "message": {"users": users}});
    }
    else {
        res.send({"code": 4, "status": "failed", "message": {"users": users}});
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
 * Retrieving all private messages between 2 users
 */

app.post("/api/private_chat", function(req, res) {
    var from = req.body.from;
    var to = req.body.to;
    var user = reOrderUsernames([from, to]);
    console.log(user[0] + tableSeperator + user[1])
    db.collection(user[0] + tableSeperator + user[1]).find().toArray().then(function(data) {
        for(var i = 0; i < data.length; i++) {
            data[i].msgDate = ta.ago(data[i].msgTime);
        }
        res.send(data);
    }, function(err) {
        console.log(err);
        res.send({"code": 6, "status": "failed", "message": err})
    });
    
})

app.post('/api/userdata', function(req, res) {
    var username = req.body.username;
    db.collection('users').find({"username": username}).toArray().then(function(data) {
        console.log("/api/userdata", data);
        res.send({"code": 8, "status": "success", "message": data});
    }, function(err) {
        console.log("/api/userdata", err);
        res.send({"code": 9, "status": "failed", "message": "Failed to retrieve user"});
    });
});

/**
 * Initiating socket connection
 */

io.on('connection', function(client) {

    /**
     * Registering user in system cache
     */

    client.on('logged', function(username) {
        console.log(username);
        activeUsers[username] = {"socketId": client.id};
        activeUsers[client.id] = {"username": username, "socket": true};
        client.broadcast.emit('new_user', getActiveUsers());
    });

    /**
     * Sending private message to and from the two users
     */

    client.on('private_message', function(username, message) {
        console.log("User socket information", activeUsers[client.id]);
        console.log("username", username, ", message", message);
        var users = reOrderUsernames([activeUsers[client.id].username, username]);
        console.log(users);
        var message = {"username": activeUsers[client.id].username, "msgContent": message, "msgTime": new Date()};
        db.collection(users[0] + tableSeperator + users[1]).insertOne(message, function(err, res) {
            if(err) {
                // console.log(err);
            }
            else {
                // console.log(res);
            }
            message.msgDate = ta.ago(new Date());
            io.of('/').to(activeUsers[username].socketId).emit('messages', message);
            client.emit('messages', message);
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
        client.broadcast.emit('messages', msg);
        client.emit('messages', msg); 
    });

    client.on('logout', function(username) {
        delete activeUsers[client.id];
        delete activeUsers[username];
        delete offlineUsers[client.id];
        client.broadcast.emit('new_user', getActiveUsers());
        console.log("User", username, "logged out");
        console.log(activeUsers);
    });

    client.on('disconnect', function() {
        if(activeUsers[client.id]) {
            delete activeUsers[activeUsers[client.id].username];
        }
        delete activeUsers[client.id];
        delete offlineUsers[client.id];
        client.broadcast.emit('new_user', getActiveUsers());
        console.log("User disconnected");
        console.log(activeUsers);
    });

    client.on('toggle_status', function() {
        var username = activeUsers[client.id].username;
        console.log("user", username);
        if(offlineUsers[username]) {
            console.log("Online");
            delete offlineUsers[username];
        }
        else {
            console.log("Offline");
            offlineUsers[username] = true;
        }
        var online_users = getOnlineUsers(getActiveUsers());
        console.log(JSON.stringify(online_users, null, 4));
        client.broadcast.emit('online_users', online_users);
    })
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
      publicMessages = [];
  });
}
