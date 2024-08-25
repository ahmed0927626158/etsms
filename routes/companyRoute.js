const express=require("express")
const {getGrade,getGrades,registerCompny,updateLtterGrade,deleteGrade,updateGrade}=require("../controller/companyCtr")
const route=express.Router()


route.get("/all",getGrades)
route.get("/:id",getGrade)
route.post("/register",registerCompny)
route.delete("/delete",deleteGrade)
route.put("/edit/total-lt-grade",updateLtterGrade)
route.put("/edit/grade",updateGrade)
route.post("/auth",updateGrade)

module.exports=route