const dotenv = require('dotenv');
const express = require('express')

const app = express()
const port = 8081

dotenv.config();

app.use(express.static('dist'))

app.get("/",(req,res) =>{
  res.sendFile("dist/index.html");
})

app.listen(port, function () {
  console.log('NPL Evaluator is listening on port 8081! - http://localhost:8081/')
 })