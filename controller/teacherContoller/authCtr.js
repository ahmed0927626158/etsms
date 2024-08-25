const dbPool=require("../../config/dbConfig")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const session = require('express-session');


const teacherLogin=(req,res)=>{
const {email,password}=req.body
const selectTeacherQuery="SELECT id,firstname,middlename,password_status,account_status,company_id,password FROM techer WHERE email=?"
try {
    dbPool.query(selectTeacherQuery,[email],(error,result)=>{
        if(error){
            
            return res.status(400).json({error:error['sqlMessage']})
        }
        if(result.length==0){
            return res.status(400).json({error:"Invalid credentials"})
        }
        if(result[0]['account_status']!='open'){
            return res.status(400).json({error:"Your account has been locked"})
        }
        let hashPassword=result[0]['password']
        let id=result[0]['id']
        const company_id=result[0]['company_id']
        const password_status=result[0]['password_status']
        const name=result[0]['firstname']+" "+result[0]['middlename']
        bcrypt.compare(password, hashPassword, (err, result) => {
            if (err) {
            //   console.error('Error comparing passwords: ', err);
              return res.status(500).send({error:error});
            }
      
        if(!result){
            return res.status(401).json({error:"Invalid credentials"})
        }
       
        if(password_status=='new')
            {
        //    res.redirect("/teacher-password-update")
          return res.status(200).json({location:"/teacher-password-update?email="+email})
           }
        // Generate token for teacher request header
        token=jwt.sign({id,company_id},process.env.SECRET_KEY,{expiresIn:"1d"})
        res.cookie('school-teacher-jwt',token,{ maxAge: 24 * 60 * 60 * 1000 ,httpOnly:true})
        const teacher = 
            { email: email, name: name }
    
        req.session.teacher = teacher;
        return res.status(200).json({location:"teacher-home"})
    })
    })
} catch (error) {
    return res.status(500).json({error:"Internal server error"})
}
}

const logOutCtr=(req,res)=>{
   
    res.clearCookie('school-teacher-jwt');
    return res.redirect("/teacher-login")
}

const updatePassword=(req,res)=>{
    const selectTeacherQuery="SELECT id,password_status,account_status,company_id,password FROM techer WHERE email=?"
    const updatePassword="UPDATE techer SET password=?,password_status=? WHERE email=?"
    try{
        const {email,current_password,new_password}=req.body
        dbPool.query(selectTeacherQuery,[email],async(error,result)=>{
            if(error){
                console.log("sqlMessage")
            }
      if(result[0]['account_status']!='open'){
          return res.status(403).json({error:"Your haa been loacked please contact admin"})
            }
      if(result.length==0){
         return res.status(404).json({error:"You have no account yet"})
            }
      if(result[0]['password_status']!='new'){
         return res.status(400).json({error:"Please login "})
        }
        bcrypt.compare(current_password, result[0]['password'], async(err, result) => {
            if (err) {
            //   console.error('Error comparing passwords: ', err);
              return res.status(500).send({error:error});
            }
        if(!result){
            return res.status(401).json({error:"Invalid credentials"})
        }
        const hashPassword= await bcrypt.hash(new_password,10)
        const password_status='updated'
        dbPool.query(updatePassword,[hashPassword,password_status,email],(error,result)=>{
            if(error){
                console.log(error['sqlMessage'])
            }
            if(result['changedRows']!=1){
                return res.status(400).json({error:"Password not updated"})
             }
             return res.status(200).json({updated:"Passowrd updated successfuly"})
        })

    })

       

        })
       
    }catch(error){

    }
}

module.exports={teacherLogin,logOutCtr,updatePassword}