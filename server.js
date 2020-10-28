const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
/* Start picture server declarations */
const pictureRoutes = express.Router();
const cors = require('cors');
const bodyParser = require("body-parser");
const port = 3000;
const formidable = require('formidable');
const util = require('util');

app.use(cors());
/* app.use(bodyParser.json()); */
/* End picture server declarations */

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
    changeRoom(newRoom);
  });

  socket.on('directMessage', function (contact) {
    console.log(contact);
    /* changeRoom(newRoom); */
  });

  const changeRoom = (room) => {
    if (room === '') {
      room = 'group';
    }
    socket.leave(socket.room);
    console.log(socket.username + " left room " + socket.room);
    socket.join(room);
    socket.room = room;
    console.log(socket.username + " joined " + socket.room);
  };

});

const server = http.listen(9090, function () {
  console.log('listening on *:9090');
});

/* Start of the picture server stuff */
pictureRoutes.route('/add').post(function(req, res) {
  console.log(req);
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    console.log('Files', files);
    console.log(files.file.path);
    if (err) {
      console.error(err.message);
      res.writeHead(200, { "content-type": "text/plain" });
      res.write("upload failed");

      res.end();
    } else {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');

      res.end(util.inspect({fields: fields, files: files}));
    }
  });
});

app.use('/picture', pictureRoutes);

app.listen(port, () =>
  console.log(`picture listening on ${port}`)
);
/* End of the picture server stuff */
