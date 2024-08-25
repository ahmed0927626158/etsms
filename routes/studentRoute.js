const express=require("express")
const {getStudents,getStudent,registerStudent,updateStudent,deleteStudent,getSchoolStudentsForLink}=require("../controller/studentCtr")
const route=express.Router()

route.get("/all",getStudents)
route.get("/all-student-link",getSchoolStudentsForLink)
route.get("/:id",getStudent)
route.post("/register",registerStudent)
route.put("/:id",updateStudent)
route.delete("/:id",deleteStudent)

module.exports=route