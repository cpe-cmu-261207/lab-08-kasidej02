const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs"); 
const { json } = require("body-parser");

//to post you must use bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("assets"));
app.get("/", (req, res) => {
  res.end(fs.readFileSync("./instruction.html"));
});

//implement your api here
const myCourses = require('./myCourses.json')

//GET ดึงข้อมูลมาทั้งหมด
app.get('/courses', (req,res) => {
    return res.json({
    success: true,
    data: myCourses
  })
})

// GET ดึงข้อมูลแบบมีเงื่อนไข 
app.get('/courses/:id', (req, res) => {
  var data =  myCourses.courses.find(courses => courses.courseId === +req.params.id)
  if(!data){
    return res.status(404).json({
      success: false,
      data: null
    })
  }else{
    return res.json({
    success: true,
    data
  })
  }
})

// DELETE 
app.delete('/courses/:id', (req,res) =>{
  const deletedIndex = myCourses.courses.findIndex(courses => courses.courseId === +req.params.id)
  if(deletedIndex === -1){
    return res.json({
      success: false,
      data: myCourses
    })
  }else{
    myCourses.courses.splice(deletedIndex,1)
    res.json({
    success: true,
    data: myCourses
  })
  }
})

//POST
app.post('/addCourse' , (req,res) => {
  const parserObject = Object.keys(req.body)

  if(parserObject.length != 4){
    return res.status(422).json({
      success: false,
      error: "ใส่ข้อมูลไม่ครบ"
    })
  }else{
    myCourses.courses.push(req.body)
    res.status(201).json({
      success: true,
      data: req.body
    })
  }
})

//follow instruction in http://localhost:8000/

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server started on port:${port}`));
