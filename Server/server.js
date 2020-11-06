require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const cors = require('cors');
app.use(cors());

// const server = http.createServer(app);
const server = app.listen(process.env.PORT || port, () => console.log('server is running'));
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

// mongoose
//   .connect(
//     'mongodb+srv://KwonGiseok:gab4r2K5fao0hxMx@cluster0.1fcgr.gcp.mongodb.net/HealthFriend?retryWrites=true&w=majority',
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => {
//     server.listen(process.env.PORT || port, () => console.log('server is running'));
//   })
//   .catch((err) => console.log(err));

<<<<<<< HEAD
// mongoose
//   .connect(
//     'mongodb+srv://KwonGiseok:gab4r2K5fao0hxMx@cluster0.1fcgr.gcp.mongodb.net/HealthFriend?retryWrites=true&w=majority',
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => {
//     server.listen(process.env.PORT || port, () => console.log('server is running'));
//   })
//   .catch((err) => console.log(err));

=======
>>>>>>> 9e3eae97ed6516ebde004d1597ff8941a6289ff8

server.listen(process.env.PORT || port, () => console.log('server is running'));