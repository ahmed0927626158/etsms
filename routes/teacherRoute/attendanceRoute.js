const express=require("express")
const {getStudents,getStudent,fillAttendance,updateStudentAttendance,deleteStudent}=require("../../controller/teacherContoller/normalAttendanceCtr")
const route=express.Router()

route.get("/all",getStudents)
route.post("/mark-attendance",fillAttendance)
route.get("/:id",getStudent)
route.put("/update-attendance",updateStudentAttendance)
route.delete("/:id",deleteStudent)

module.exports=route