
const dbPool=require("../config/dbConfig")
const generateToken=require("../utils/generateToken")
const companyLogin=(req,res)=>{
const selectCompany="SELECT id,name,password_status,account_status FROM company WHERE email=? AND password=?"
const {email,password}=req.body

dbPool.query(selectCompany,[email,password],(error,result)=>{
    if(error){
        return res.status(400).json({error:error['sqlMessage']})
    }
    if(result.length==0){
    return res.status(401).json({error:"Invalid credentials"})
    }
    let account_status,password_status,id
    account_status=result[0]['account_status']
    if(account_status=='locked')
    {
    return res.status(401).json({error:"Account locked"})   
    }
    password_status=result[0]['password_status']
    if(password_status=="new"){
        // return res.status(202).json({data:"password must be update"})
    }
    id=result[0]['id']
   const token= generateToken(id)
    res.cookie('school-jwt',token,{ maxAge: 24 * 60 * 60 * 1000 ,httpOnly:true})
    // res.redirect("/home")
    return res.status(200).json({user:id})
})
// return res.status(200).json({data:"hello"})
}
module.exports={companyLogin}
