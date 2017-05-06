const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/test";

app.use('/node_modules',express.static(__dirname + '/node_modules'));
app.use(bodyParser.json())

MongoClient.connect(url, function(err, db) {
    if(err) {
        console.log("Couldn't connect to mongodb", err);
    }
    else {
        console.log("Connected successfully");
        server.listen(8080);
    }
})