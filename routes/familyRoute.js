const express=require("express")
const {getFamliy,getFamliys,registerFamily,updateFamily,deleteFamily,getSchoolFamilyForLink}=require("../controller/familyCtr")
const route=express.Router()


route.get("/all",getFamliys)
route.get("/all-family-link",getSchoolFamilyForLink)
route.get("/info/:id",getFamliy)
route.post("/register",registerFamily)
route.put("/update/:id",updateFamily)
route.delete("/delete/:id",deleteFamily)

module.exports=route