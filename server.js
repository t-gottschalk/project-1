var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = express();
var path = require('path')
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dburl = "mongodb://localhost:27017";

app.use('/assets',express.static(path.join(__dirname, '/assets')));


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		MongoClient.connect(dburl, function(err, db) {
			assert.equal(null, err);
			console.log("Connected successfully to server");

			db.close();
		});
	});
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
});

http.listen(8080, function(){
	console.log('listening on *:8080');
});
