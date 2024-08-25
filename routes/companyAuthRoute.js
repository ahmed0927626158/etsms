const express=require("express")
const {companyLogin}=require("../controller/companyLoginAuth")
const route=express.Router()

route.post("/auth",companyLogin)

module.exports=route