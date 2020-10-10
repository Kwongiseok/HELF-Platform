const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the Auth');
});

app.use('/api/users', authRoutes);

mongoose
  .connect(
    'mongodb+srv://KwonGiseok:LjxT3DnkR81vPlN8@cluster0.1fcgr.gcp.mongodb.net/HealthFriend?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(3000, () => console.log('server is running'));
  })
  .catch((err) => console.log(err));
