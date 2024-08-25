const express=require("express")
//////const {teacherLogin}=require("../../controller/teacherContoller/loginCtr")
const {homeInfo}=require("../../controller/teacherContoller/homeInfo")
const {viewAttendanceCtr,getSingleAttendance}=require("../../controller/teacherContoller/viewattendance")
const {getSectionOfGrade}=require("../../controller/teacherContoller/gradeCtr")
const route=express.Router()
route.get("/home-info",homeInfo)
route.get("/attendance-history",viewAttendanceCtr)
route.get("/single-attendance/:id",getSingleAttendance)
route.get("/grade-section/:id",getSectionOfGrade)

module.exports=route