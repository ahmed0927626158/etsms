const express=require("express")
const {getMark,getMarks,registerMark,updateMark,deleteMark}=require("../controller/markCtr")
const route=express.Router()

route.get("/all",getMarks)
route.get("/:id",getMark)
route.post("/register",registerMark)
route.delete("/delete",deleteMark)
route.put("/:id",updateMark)

module.exports=route