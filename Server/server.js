require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const cors = require('cors');
const authRouter = require('./routes/auth');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRouter);
const server = http.createServer(app);
const port = 5000;
// const server = app.listen(process.env.PORT || port, () => console.log('server is running'));
const socket = require("socket.io");
const io = socket(server);
const mongoose = require('mongoose');
const users = {};
const socketToRoom = {};
const rooms = [];
// app.post('/api', async (req,res) => {
//     let name = req.body.name_post;
//     console.log(name);
//     res.send();
// })
app.get('/api/roomList' , async(req,res) => {
    // const names = Object.values(rooms);
    // const listItem = names.map((name)=> <li>{name}</li>);
    res.send(rooms);
})
io.on('connection', socket => {
    socket.on("join room", (obj) => {
        // socket.join(roomID);
        //rooms.push(roomName);
        // console.log(roomName);
        const roomID = obj['roomID'];
        const roomName = obj['roomName'];
        rooms.push(roomName);
        console.log(rooms);
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

mongoose
  .connect(
    'mongodb+srv://KwonGiseok:gab4r2K5fao0hxMx@cluster0.1fcgr.gcp.mongodb.net/HealthFriend?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    server.listen(process.env.PORT || port, () => console.log('server is running'));
  })
  .catch((err) => console.log(err));


// server.listen(process.env.PORT || port, () => console.log('server is running'));