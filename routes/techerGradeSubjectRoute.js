const express=require("express")
const {getTeacherGradeSub,getTecherGradeSubs,registerTecherGradeSub,getTecherGradeSubLink,deleteTeacherGradeSubs}=require("../controller/techerGradeSubjectCtr")
const route=express.Router()


route.get("/all",getTecherGradeSubs)
route.post("/register",registerTecherGradeSub)
route.get("/info/:id",getTeacherGradeSub)
route.delete("/delete/:id",deleteTeacherGradeSubs)
// route.put("/:id",registerStudent)

module.exports=route