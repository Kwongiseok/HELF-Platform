const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  //check if mail exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    //DB에 새로운 유저 등록
    const user_new = new User({
      fullName: req.body.profileObj.name,
      email: req.body.profileObj.email,
    });
    try {
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (error) {
      res.status(400), send(error);
    }
  }
  //check if
  if (user) {
    // DB에 있다면
  }

  //create and assign a token
  const token = jwt.sign(
    { _id: User._id, email: User.email },
    'SUPERSECRET123'
  );
  res
    .header('auth-token', token)
    .send({ message: 'Logged in successfully', token });
});

module.exports = router;
