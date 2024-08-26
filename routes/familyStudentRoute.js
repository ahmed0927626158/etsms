const express=require("express")
const {getFamilyStudent,getFamilyStudents,registerFamilyStudent,updateFamilyStudent}=require("../controller/familyStudentCtr")
const route=express.Router()


route.get("/all",getFamilyStudents)
route.get("/info/:id",getFamilyStudent)
route.post("/register",registerFamilyStudent)
route.put("/:id",updateFamilyStudent)

module.exports=route