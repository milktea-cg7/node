var express = require('express');
var ejs     = require('ejs');
var io      = require('socket.io');
var port    = 3000;
var app     = express.createServer();

// Static File
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

// Template Engine
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

// Output
app.get('/', function(req, res) {
    console.log('/');
    res.render('index', { locals: { port: port } });
});

// port Listen
app.listen(port);

// Socket
var listen = io.listen(app);
listen.sockets.on("connection", function(client) {
    // system
    client.on("join", function(recv) {
        client.set("name", recv.name, function() {
	    console.log(recv.name + " connected.");
	    var data = {
	        "name" : recv.name, 
		"do"   : "join", 
		"time" : new Date().toString()
	    };
	    client.emit("system", data);
	    client.broadcast.emit("system", data);
	});
    });

    // post
    client.on("post", function(msg) {
	client.get("name", function(err, name) {
	    var data = {
	        "name" : name, 
		"post" : msg, 
		"time" : new Date().toString()
	    };
	    client.emit("post", data);
	    client.broadcast.emit("post", data);
	});
    });

    // disconnect
    client.on('disconnect', function() {
	client.get("name", function(err, name) {
	    console.log(name + " disconnected.");
	    client.broadcast.emit("system", {
		"name" : name, 
		"do"   : "leave", 
		"time" : new Date().toString()
	    });
	});
    });
});

// Debug
console.log('Server running at http://127.0.0.1:' + port + '/');
