const express=require("express")
const {getSubjectOfSection,getSectionStudents}=require("../../controller/teacherContoller/sectionCtr")
const route=express.Router()


// route.get("/all",getGrades)
route.get("/subject/:id",getSubjectOfSection)
route.get("/student/:id",getSectionStudents)
// route.post("/register",registerGrade)
// route.delete("/delete",deleteGrade)
// route.put("/edit/total-lt-grade",updateLtterGrade)
// route.put("/edit/grade",updateGrade)
// route.put("/:id",updateGrade)

module.exports=route