var express = require('express');
var app = express();
var http = require('http').Server(app);
var server = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

server.listen(3001);

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

// Add a connect listener
socket.on('connection', function(client){ 
	console.log('Client has connected');
	// Success!  Now listen to messages to be received
	client.on('message',function(event){ 
		console.log('Received message from client!',event);
	});
	client.on('disconnect',function(){
		//clearInterval(interval);
		console.log('Server has disconnected');
	});
	

});





var net = require('net');

var clienttcp = new net.Socket();
clienttcp.connect(5038, '127.0.0.1', function() {
	console.log('ATS API Connected');
	fs = require('fs');
	fs.readFile('/var/www/pass', 'utf8', function (err,fdata) {
										if (err) {
											return console.log(err);
											}
											var auth='Action: login\nUsername: admin\nSecret: '+fdata+'\n\n'
											console.log(auth);
											clienttcp.write(auth);
										});
});

clienttcp.on('data', function(data) {
		if(/Event: PeerStatus/i.test(data))
		console.log(''+data);
	    socket.emit('sip', { Event: ''+data });
		
});

clienttcp.on('close', function() {
	console.log('Connection closed');
});


