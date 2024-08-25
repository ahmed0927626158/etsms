const express=require("express")
const {getLetterGrade,getLetterGrades,registerLetterGrade,deleteLetterGrade,getSectionOfGrade,getSectionAndGrade}=require("../controller/letterGradeCtr")
const route=express.Router()


route.get("/all",getLetterGrades)
route.get("/all/section-grade",getSectionAndGrade)
route.get("/:id",getLetterGrade)
route.get("/section-of-grade/:grade",getSectionOfGrade)

route.post("/register",registerLetterGrade)
route.delete("/delete",deleteLetterGrade)
// route.put("/:id",registerStudent)

module.exports=route