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
let roomGets = []; // map 형태로 데이터를 쏠 때 안돼서 일단 배열형태로 진행

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
            console.log(roomGets,roomName);
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        socket.emit("all users", usersInThisRoom);
        console.log(users[roomID]);
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
        socket.broadcast.emit('user left',socket.id);
        if (room && room.length < 1) {
            const roomname_tmp = roomIDs.get(roomID); // roomName 검색
            const roomGetsDelAddr = roomGets[rooms.indexOf(roomname_tmp)]; // roomGets 주소를 찾아서 삭제하기 위함
            const rooms_tmp = rooms.filter(roomName => roomName !== roomname_tmp); //방이름 같은 거 예외처리 해야함
            rooms = rooms_tmp;

            const roomGets_tmp = roomGets.filter(Addr => Addr !== roomGetsDelAddr);
            roomGets = roomGets_tmp;
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