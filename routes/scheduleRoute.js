const express=require("express")
const {getSchedule,getSchedules,registerSchedule,getAssignSchedule}=require("../controller/scheduleCtr")
const route=express.Router()


route.get("/all",getSchedules)
route.get("/assign-schedule",getAssignSchedule)
route.get("/:id",getSchedule)
route.post("/register",registerSchedule)
// route.put("/:id",registerStudent)

module.exports=route