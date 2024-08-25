const jwt=require("jsonwebtoken")
const secret=process.env.SECRET_KEY
const generateToken=(id)=>{
    token=jwt.sign({id},secret,{expiresIn:"1d"})
    return token
}
module.exports=generateToken