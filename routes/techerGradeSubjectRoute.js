const express=require("express")
const {getTecherGradeSub,getTecherGradeSubs,registerTecherGradeSub,getTecherGradeSubLink}=require("../controller/techerGradeSubjectCtr")
const route=express.Router()


route.get("/all",getTecherGradeSub)
route.post("/register",registerTecherGradeSub)
route.get("/link",getTecherGradeSubLink)
route.get("/:id",getTecherGradeSubs)
// route.put("/:id",registerStudent)

module.exports=route