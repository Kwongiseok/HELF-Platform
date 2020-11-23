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
const { mapReduce } = require('./models/User');
const users = {};
const socketToRoom = {};
let rooms = [];
let roomIDs = new Map();
let roomGets = [];

app.get('/api/roomList' , async(req,res) => {
    res.send({roomGets,rooms});
})

io.on('connection', socket => {
    socket.on("join room", (obj) => {
        const roomID = obj['roomID'];
        const roomName = obj['roomName'];
        // 중복되는 방제목 오면 예외처리 구현 예정        
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
            roomGets.push(roomID);
            rooms.push(roomName);
            roomIDs.set(roomID,roomName);
            console.log(roomGets);
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
        // 사용자가 1명도 없는 방은 없애버리는 기능 구현해야함
        // if (room.length < 1) { // 캠 켜지기전에 닫으면 서버가 죽는다 => 에러 고치기전에 사용 X
        //     const roomname_tmp = roomIDs.get(roomID); // roomName 검색
        //     const rooms_tmp = rooms.filter(roomName => roomName !== roomname_tmp); //방이름 같은 거 예외처리 해야함
        //     rooms = rooms_tmp;
        // }
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