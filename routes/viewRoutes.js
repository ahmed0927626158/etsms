const express=require("express")
const route=express.Router()


route.get("/teacher",(req,res)=>{
    res.render("teacher",{data:[{name:"Ahmed",subject:"Maths"}],date:"Hello"})
})

module.exports=route