var express = require('express');
var app = express();
var http = require('http').Server(app);
var server = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');

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
		var receiv = JSON.parse(event);
		console.log(receiv.sip);
		switch(receiv.sip) {
			case 'get_client_status':
			get_client_status(receiv.user);
		break
			case 'value2':  // if (x === 'value2')
		default:
		}
		
	});
	client.on('disconnect',function(){
		//clearInterval(interval);
		console.log('Server has disconnected');
	});
	

});

//clien mess's example
//socket.send('{"sip" : "get_client_status","user":"119"}')

var sips_status = new Object();
var sips_status = {};


//TCP Exchange
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
		console.log(''+data);
		var msg=''+data;
		AstMess=msg.split('\n');
		pars_ast_mess(AstMess);
	    socket.emit('sip', { Event: ''+data });
		
});

clienttcp.on('close', function() {
	console.log('Connection closed');
});


function get_client_status(user){
	var mess="Action: ExtensionState\nContext: ext-local-custom\nExten: "+user+"\n\n";
	console.log('Send Action'+mess);
	clienttcp.write(mess);
}

function pars_ast_mess(Mess){
		switch (true) {
      case /Event:/i.test(Mess[0]):
			if (/PeerStatus/i.test(Mess[0])){
				sips_status[Mess[3].match(/[0-9]{1,}/)]=Mess[4].replace("PeerStatus: ", "").match(/[a-zA-Z]{1,}/);
				console.log(JSON.stringify(sips_status));
				//console.log(JSON.parse(JSON.stringify(sips_status))[119][0]);
			}
        break;
      case /Response: Success/i.test(Mess[0]):
			if (/Extension Status/i.test(Mess[1])){
			sips_status[Mess[2].match(/[0-9]{1,}/)]=Mess[5].replace("Status: ", "").match(/[0-9]{1,}/);
			console.log(JSON.stringify(sips_status));
			//console.log(JSON.parse(JSON.stringify(sips_status))[119][0]);
		}
        break;
      default:
        break;
    }
}




