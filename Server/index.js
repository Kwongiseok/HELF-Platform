let cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());

app.get('/',(req,res) => {
    res.send("Welcome to the Auth");
})

app.listen(3000,()=> console.log("Server is running"));