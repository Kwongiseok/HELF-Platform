require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const mongoose = require('mongoose');
const users = {};
const port = 5000;
const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});



/* Node js 에서 돌아가는 줌 */
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const mongoose = require('mongoose');
// const server = require('http').Server(app);
// const authRoutes = require('./routes/auth');
// const api = require('./routes/index');
// const port = 5000;
// const io = require('socket.io')(server);

// app.set('view engine', 'ejs');
// app.use(express.static('public'));
// app.use(cors());
// app.use('/api',api);


// io.on('connection', socket => {
//   socket.on('join-room', (roomId,userId) => {
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected',userId)

//     socket.on('disconnect' , ()=> {
//       socket.to(roomId).broadcast.emit('user-disconnected', userId)
//     })
//   })
// })

mongoose
  .connect(
    'mongodb+srv://KwonGiseok:gab4r2K5fao0hxMx@cluster0.1fcgr.gcp.mongodb.net/HealthFriend?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    server.listen(process.env.PORT || port, () => console.log('server is running'));
  })
  .catch((err) => console.log(err));

