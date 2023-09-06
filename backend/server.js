require('dotenv').config();
const express = require('express');
const router = require('./routes');
const DbConnect = require('./database');
const cors = require('cors');

const corsOption = {
  origin: ['http://localhost:5173']
}
const app=express(); 
app.use(cors(corsOption));

const PORT = process.env.PORT || 5500
DbConnect();
app.use(router);

app.get("/",(req,res)=>{
  res.send("hello")
});

app.listen(PORT,()=>console.log(`listening on port ${PORT}`));