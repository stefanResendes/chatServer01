const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
  /* res.render('index.ejs'); */
});

io.sockets.on('connection', function (socket) {
  socket.on('username', function (username) {
    socket.username = username;
    io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
  });

  socket.on('disconnect', function (username) {
    io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
  });

  socket.on('chat_message', function (message) {
    io.emit(
      'chat_return',
      message
      /* '<strong>' + message[0].user._id + '</strong>: ' + message[0].text */
    );
  });
});

const server = http.listen(9090, function () {
  console.log('listening on *:9090');
});
