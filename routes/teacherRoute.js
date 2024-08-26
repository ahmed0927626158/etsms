const express=require("express")
const {getTecher,getTechers,getSchoolTeacherForLink,registerTecher,updateTeacher,deleteTeacher}=require("../controller/teacher")
const route=express.Router()


route.get("/all",getTechers)
route.get("/all-teacher-link",getSchoolTeacherForLink)
route.get("/info/:id",getTecher)
route.post("/register",registerTecher)
route.delete("/delete/:id",deleteTeacher)
route.put("/update/:id",updateTeacher)

module.exports=route