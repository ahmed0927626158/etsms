const express=require("express")
const {getGrade,getGrades,registerGrade,updateLtterGrade,deleteGrade,updateGrade,gradeInfo}=require("../controller/gradeCtr")
const route=express.Router()


route.get("/all",getGrades)
route.get("/grade-info",gradeInfo)
route.get("/:id",getGrade)
route.post("/register",registerGrade)
route.delete("/delete",deleteGrade)
route.put("/edit/total-lt-grade",updateLtterGrade)
route.put("/edit/grade",updateGrade)
// route.put("/:id",updateGrade)

module.exports=route