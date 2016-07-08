var express = require('express'),
app = express(),
server = app.listen(8077, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Server is Here!');
}),
io = require('socket.io').listen(server);
app.get('/', function (req, res) {
  res.send('hello,pidor!');
});
