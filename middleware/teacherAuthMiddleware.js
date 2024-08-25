const dbPool=require("../config/dbConfig")
const jwt=require("jsonwebtoken")
const authMiddleware=(req,res,next)=>{
const selectTeacher="SELECT id,company_id,email FROM techer WHERE id=? AND company_id=?"

    const token=req.cookies["school-teacher-jwt"]
    if(!token){
       return res.redirect("/teacher-login")
        // return res.status(401).json({error:"No attached token"})
    }
    try {
        const decoded=jwt.verify(token,process.env.SECRET_KEY)
        const id=decoded.id
        const company_id=decoded.company_id
        dbPool.query(selectTeacher,[id,company_id],(error,result)=>{
            if(error){
                return res.status(401).json({error:error['sqlMessage']})
            }
            // if id not found
            if(result.length==0){
              return  res.redirect("/teacher-login")
                // return res.status(401).json({error:"Not Authenticated user"})
            }
            req.id=id
            req.company_id=company_id
            next()
        })

       
    } catch (error) {
       return res.redirect("/teacher-login")
        // return res.status(401).json({error:"Not Authenticated user"})
    }
    // const {authorization}=req.headers
    // if(!authorization){
    //     return res.status(404).json({errorl:"No attached token"})
    // }
    // const token=authorization.split(' ')[1]
    // try {
    //   const {id,company_id}=  jwt.verify(token,process.env.SECRET_KEY)
    //   req.company_id=company_id
    //   req.id=id
    //   next()
    // } catch (error) {
    //     return res.status(401).json({error:"Invalid credential"})
    // }

}

module.exports=authMiddleware