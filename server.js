const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
  /* res.render('index.ejs'); */
});

var usernames = {};
var rooms = ['group', 'room1'];

io.sockets.on('connection', function (socket) {

  socket.on('username', function (username) {
    socket.username = username;
    socket.room = 'group';
    usernames[username] = username;
    socket.join('group');
    io.emit("is_online", "🔵 <i>" + socket.username + " join the chat..</i>" + socket.room);
  });

  socket.on('disconnect', function (username) {
    io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
  });

  socket.on('chat_message', function (message) {
    console.log(socket.username + ' sent to ' + socket.room);
    io.sockets.in(socket.room).emit('chat_return', message);
  });

  socket.on('switchRoom', function (newRoom) {
    socket.leave(socket.room);
    console.log(socket.username + ' left room ' + socket.room);
    socket.join(newRoom);
    socket.room = newRoom;
    console.log(socket.username + " joined " + socket.room);
  });
});


const server = http.listen(9090, function () {
  console.log('listening on *:9090');
});
