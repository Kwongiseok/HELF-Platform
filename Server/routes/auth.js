const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/' , async(req,res)=> {
  res.send("HI")
})
// router.post('/', async(req,res)=> {
//   console.log(req.body.name_post);
//   console.log(req.body.email_post);
//   res.send()
// })

router.post('/', async (req, res) => {
  //check if mail exist
  
  console.log(req.body.name_post);
  const user = await User.findOne({ email: req.body.email_post });
  if (!user) {
    //DB에 새로운 유저 등록
    const user_new = new User({
      fullName: req.body.name_post,
      email: req.body.email_post,
    });
    try {
      user_new.save()
      .then(console.log("result"));
    } catch (error) {
      res.status(400), send(error);
    }
  }
  //check if
  if (user) {
    // DB에 있다면
    console.log("already exist");
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
