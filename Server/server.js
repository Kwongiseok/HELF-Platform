const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const server = require('http').Server(app);
const authRoutes = require('./routes/auth');
const api = require('./routes/index');
const port = 5000;
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use('/api',api);


io.on('connection', socket => {
  socket.on('join-room', (roomId,userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected',userId)

    socket.on('disconnect' , ()=> {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

mongoose
  .connect(
    'mongodb+srv://KwonGiseok:gab4r2K5fao0hxMx@cluster0.1fcgr.gcp.mongodb.net/HealthFriend?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    server.listen(port, () => console.log('server is running'));
  })
  .catch((err) => console.log(err));

