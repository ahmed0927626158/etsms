const express=require("express")
const {getSchedulePart,getScheduleParts,registerSchedulePart,updateSchedule,deleteSchedulePart}=require("../controller/schedulePartCtr")
const route=express.Router()


route.get("/all",getScheduleParts)
route.get("/:id",getSchedulePart)
route.post("/register",registerSchedulePart)
route.delete("/:id",deleteSchedulePart)
route.put("/:id",updateSchedule)

module.exports=route