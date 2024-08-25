const express=require("express")
const {getFamliy,getFamliys,registerFamily,updateFamily,deleteFamily,getSchoolFamilyForLink}=require("../controller/familyCtr")
const route=express.Router()


route.get("/all",getFamliys)
route.get("/all-family-link",getSchoolFamilyForLink)
route.get("/:id",getFamliy)
route.post("/register",registerFamily)
route.put("/:id",updateFamily)
route.delete("/delete/:id",deleteFamily)

module.exports=route