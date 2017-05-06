const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/test";

var db = null;

app.use('/node_modules',express.static(__dirname + '/node_modules'));
app.use(bodyParser.json())

MongoClient.connect(url, function(err, dbc) {
    if(err) {
        console.log("Couldn't connect to mongodb", err);
    }
    else {
        console.log("Connected successfully");
        server.listen(8080);
        db = dbc;
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

