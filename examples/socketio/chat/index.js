// Express initializes app to be a function handler
//   that you can supply to an HTTP server (as seen in line 4).
var app = require('express')();
var http = require('http').Server(app);
// initialize a new instance of socket.io by passing
//   the http (the HTTP server) object.
var io = require('socket.io')(http);

// We define a route handler '/' that gets called when we hit our website home.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//// listen on the connection event for incoming sockets,
////   and I log it to the console.
//io.on('connection', function(socket){
//  console.log('a user connected');
//  // Each socket also fires a special disconnect event:
//  socket.on('disconnect', function(){
//    console.log('user disconnected');
//  });
//});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    // In order to send an event to everyone, Socket.IO gives us the io.emit:
    // io.emit('some event', { for: 'everyone' });
    //
    // If you want to send a message to everyone except for a certain socket,
    //   we have the broadcast flag:
    // socket.broadcast.emit('hi');
    //
    // In this case, for the sake of simplicity we’ll send the message
    //   to everyone, including the sender.
    io.emit('chat message', msg);
  });
});

// We make the http server listen on port 3000.
http.listen(3000, function(){
  console.log('listening on *:3000');
});
