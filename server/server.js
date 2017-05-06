const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/chatdb";

var db = null;

var activeUsers = {};

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
            res.send({"code": 2, "status": "failed", "message": "username already exists"});
        }
        else {
            db.collection('users').insertOne(user);
            res.send({"code": 1, "status": "seccess", "message": "You've beeen successfully registered"});
        }
    }); 
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
        activeUsers[client.id] = {"username": username};
    });

    /**
     * Sending private message to and from the two users
     */
    
    client.on('private_message', function(username, message) {
        var users = reOrderUsernames(activeUsers[client.id], username);
        db.collection(users[0] + "LDBDwfZ1IqecOHJrj2z1" + users[1]).insertOne({"msg": message, "msgDate": new Date()}, function(err, res) {
            io.of('/').to(activeUsers[username].socketId).emit(message);
            client.emit('msg_received', {"code": 3, "status": "success", "message": message});
        });
        
    })    
})
