const { validationResult } =require("express-validator")

 const signUpCtr=(req,res)=>{
    const error=validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
console.log("Sign up controller")
}

 const loginCtr=(req,res)=>{
console.log("Login controller")
}
module.exports={signUpCtr,loginCtr}