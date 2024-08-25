const express=require("express")
const {teacherLogin,logOutCtr,updatePassword}=require("../../../controller/teacherContoller/authCtr")


const route=express.Router()

route.post("/login",teacherLogin)
route.post("/logout",logOutCtr)
route.post("/update-password",updatePassword)

module.exports=route