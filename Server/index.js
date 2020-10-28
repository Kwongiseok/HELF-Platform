const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
// const server = require('http').Server(app);
const authRoutes = require('./routes/auth');
const port = 5000;
const bodyParser = require("body-parser"); // post body를 파싱하기 위한 미들웨어
const { v4 : uuidV4} = require('uuid');

const fs = require('fs');
const https = require('https');
const server = https.createServer(
  {
    key: fs.readFileSync('./private/server.key'),
    cert: fs.readFileSync('./private/server.crt'),
    passphrase: '12345',
    
    requestCert: false,
    rejectUnauthorized: false,
  },
  app
);

const io = require('socket.io')(server);


// app.use(cors());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use("/api",authRoutes);

// app.get("/home", (req,res) => {
//   console.log("RR");
// })

// app.get('/home', (req, res) => {
//   res.send('We to the Auth');
// });

// app.use('/', authRoutes);

//video call
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',(req,res) => {
  res.redirect(`/${uuidV4()}`)
})
app.get('/:room', (req,res) => {
  res.render('room', {roomId : req.params.room})
})

io.on('connection', socket => {
  socket.on('join-room', (roomId,userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected',userId)

    socket.on('disconnect' , ()=> {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000);

// mongoose
//   .connect(
//     'mongodb+srv://KwonGiseok:gab4r2K5fao0hxMx@cluster0.1fcgr.gcp.mongodb.net/HealthFriend?retryWrites=true&w=majority',
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => {
//     app.listen(port, () => console.log('server is running'));
//   })
//   .catch((err) => console.log(err));


