var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    sent = 0;
    usernames = [];
    
var fs = require('fs');
server.listen(3000);





console.log("server started listening on port 3000");

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
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
		
		var msg_list = []; 
		    
		msg_list = loadLog(function(msg_list){
		    console.log(msg_list);
		    socket.emit('log-message',msg_list);   
		});
		
		/*	
		socket.emit('log-message',msg_list);*/
		console.log("log message emit");
		
	});


	socket.on('send-text', function(data){
		io.sockets.emit('new-message', {msg: data, user: socket.username});
		var msg = data;
		var user = socket.username;
	   appendFile(msg,user);
	});
	
   
		
	socket.on('disconnect', function(data){
		if(!socket.username) return;
		usernames.splice(usernames.indexOf(socket.username), 1);
		io.sockets.emit('new-user', usernames);
	});
	
function appendFile(msg,user){
	var record = user + ' ' + msg + "\n";	
	fs.appendFile('message.txt',record,function(err){
	    if (err) throw err;
	    console.log('appended');
	});
	
}
function loadLog(callback){
	
	fs.readFile('message.txt',function(err,data){
		if(err) throw err;
		var log_msg = data.toString();
		var msg_list = []
		msg_list = log_msg.split('\n');	
		/*console.log(msg_list);*/
		callback(msg_list);
	});
   
}

});




