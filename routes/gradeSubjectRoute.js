const express=require("express")
const {registerSubject,deleteSubjectGrade}=require("../controller/gradSubjectCtr")
const route=express.Router()



// route.get("/:id",getSubject)
route.post("/register",registerSubject)
route.delete("/delete",deleteSubjectGrade)
// route.put("/:id",registerStudent)

module.exports=route