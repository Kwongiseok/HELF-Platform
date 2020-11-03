const express = require('express');
const bodyParser = require("body-parser"); // post body를 파싱하기 위한 미들웨어
const { v4 : uuidV4} = require('uuid');
const router = express.Router();

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

// router.set('view engine', 'ejs');
// router.use(express.static('../public'));

// router.get('/',(req,res) => {
//   console.log('http://localhost:5000/api/');
//   res.json({data:'this is index.'})
// })

router.get('/video',(req,res) => {
  console.log('video')
  res.redirect(`/api/${uuidV4()}`)
})
router.get('/:room', (req,res) => {
  res.render('room', {roomId : req.params.room})
})

module.exports = router;
