const express=require("express")
const {getTecher,getTechers,getSchoolTeacherForLink,registerTecher,updateTechear,deleteTeacher}=require("../controller/teacher")
const route=express.Router()


route.get("/all",getTechers)
route.get("/all-teacher-link",getSchoolTeacherForLink)
route.get("/:id",getTecher)
route.post("/register",registerTecher)
route.delete("/:id",deleteTeacher)
route.put("/:id",updateTechear)

module.exports=route