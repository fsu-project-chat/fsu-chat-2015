var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = Number(process.env.PORT || 3000)
    usernames = [];
server.listen(port);





console.log("server started listening on port 3000")


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/test.html')
})


io.sockets.on('connection', function(socket){
	socket.on('new-user', function(data,callback){
		if(usernames.indexOf(data) != -1){
			callback(false);
		} else{
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			console.log("user added");
			io.sockets.emit('usernames', usernames);
		}
	});


	socket.on('send-text', function(data){
		io.sockets.emit('new-message', {msg: data, user: socket.username});
	});

	socket.on('disconnect', function(data){
		if(!socket.username) return;
		usernames.splice(usernames.indexOf(socket.username), 1);
		io.sockets.emit('new-user', usernames);
	});
	
	
});




