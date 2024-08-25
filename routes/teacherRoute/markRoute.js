const express=require("express")
const {getMarkTyps}=require("../../controller/teacherContoller/markCtr")
const route=express.Router()


route.get("/all",getMarkTyps)
// route.get("/subject/:id",getSubjectOfSection)
// route.get("/:id",getGrade)
// route.post("/register",registerGrade)
// route.delete("/delete",deleteGrade)
// route.put("/edit/total-lt-grade",updateLtterGrade)
// route.put("/edit/grade",updateGrade)
// route.put("/:id",updateGrade)

module.exports=route