var express = require('express');
var mongoose = require('mongoose');
var assert = require('assert');
var app = express();
var path = require('path')
var http = require('http').Server(app);
var router = express.Router()
var io = require('socket.io')(http);
var Message = require('./models/Message.js');

// Database configuration with mongoose
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/Messages");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
 console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
 console.log("Mongoose connection successful.");
});

//set static directory
app.use('/assets',express.static(path.join(__dirname, '/assets')));


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/api/history', function(req,res){
	Message.find({}, function(err, data) {
		if(err) {
			console.log('Error:', err);
		} else {
			var msg=[];
            data.forEach( function(obj){
                msg.push(obj.message);
            });
			console.log(msg);
			res.json({"messages":msg});
		}
	}).sort({_id:-1}).limit(50);
});


io.on('connection', function(socket){
	console.log('a user connected');
	//console.log(Message.find({}).sort({_id:1}).limit(50));
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){

		// Using our Message model, create a new entry
     // This effectively passes the result object to the entry
     var message = new Message({message: msg});

     // Now, save that entry to the db
     message.save(function(err, doc) {
       // Log any errors
       if (err) {
         console.log(err);
       }
       // Or log the doc
       else {
         console.log(doc);
       }
     });
		
	});
});
io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
});

http.listen(process.env.PORT  || 8080, function(){
	console.log('listening on *:8080');
});

