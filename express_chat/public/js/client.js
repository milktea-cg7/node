$(function() {
    // name
    var name = window.prompt("plz your name!");

    // connect
    var socket = new io.connect("http://127.0.0.1:3000");
    socket.on('connect', function() {
	socket.emit("join", {"name" : name});
    });
    
    // system
    socket.on("system", function(data) {
	appendMessage("system", ">>> " + data.name + " " + data.do, data.time);
    });

    // post
    socket.on("post", function(data) {
	appendMessage(data.name, data.post, data.time);
    });

    // disconnect
    socket.on("disconnect", function() {
	appendMessage("system", ">>> " + name + " disconnected", "");
    });

    // submit
    $("#form").submit(function() {
        socket.emit("post", $("#message").val());
        $("#message").val("");
        return false;
    });

    appendMessage = function(name, post, time) {
	$("#chat").prepend("<dt>" + time + "</dt><dd>" + name + ":" + post + "</dd>");	
    }
});
