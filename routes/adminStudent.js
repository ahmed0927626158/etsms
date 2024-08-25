const express =require("express")
 const router=express.Router()
 router.get('/',(req,res)=>{
    const date=new Date().toDateString();
    res.render("student/addstudent",{date:date})
})


module.exports =router