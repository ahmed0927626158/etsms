const express=require("express")
const {getGrade,getGrades,registerGrade,updateLtterGrade,deleteGrade,deleteSection,updateGrade,gradeInfo,getGradeOnly,updateGradeOnly}=require("../controller/gradeCtr")
const route=express.Router()


route.get("/all",getGrades)
route.get("/grade-info/:id",getGradeOnly)
route.get("/grade-info/",gradeInfo)
route.get("/info/:id",getGrade)
route.post("/register",registerGrade)
route.delete("/delete/:id",deleteGrade)
route.delete("/delete/section/:id",deleteSection)
route.put("/edit/section",updateLtterGrade)
route.put("/edit/grade",updateGrade)
route.put("/edit/gradeonly",updateGradeOnly)
// route.put("/:id",updateGrade)

module.exports=route