const express=require("express")
const {getScheduleTime,getScheduleTimes,registerScheduleTime,getAssignScheduleTime}=require("../controller/shcedulTimeCtr")
const route=express.Router()


route.get("/all",getScheduleTimes)
route.get("/assign-schedule-time",getAssignScheduleTime)
route.get("/:id",getScheduleTime)
route.post("/register",registerScheduleTime)
// route.put("/:id",registerStudent)

module.exports=route