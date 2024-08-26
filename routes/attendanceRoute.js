const express=require("express")
const {getStudents,getStudent,fillAttendance,updateStudent,deleteStudent}=require("../controller/teacherContoller/normalAttendanceCtr")
const route=express.Router()

route.get("/all",getStudents)
route.post("/mark-attendance",fillAttendance)
route.get("/:id",getStudent)
route.put("/:id",updateStudent)
route.delete("/:id",deleteStudent)

module.exports=route