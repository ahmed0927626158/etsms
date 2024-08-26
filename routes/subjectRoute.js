const express=require("express")
const {getSubjects,getSubject,registerSubject,deleteSubject,updateSubject,getSubjectAssign}=require("../controller/subjectCtr")
const route=express.Router()


route.get("/all",getSubjects)
route.get("/subject-assign",getSubjectAssign)
route.get("/info/:id",getSubject)
route.post("/register",registerSubject)
route.delete("/delete/:id",deleteSubject)
route.put("/update/:id",updateSubject)

module.exports=route