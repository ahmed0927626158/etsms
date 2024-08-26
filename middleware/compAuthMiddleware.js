const jwt=require("jsonwebtoken")
const dbPool=require("../config/dbConfig")
const selectCompId="SELECT name FROM company WHERE id=?"
const compAuth=(req,res,next)=>{
    const token=req.cookies["school-jwt"]
    if(!token){
      return  res.redirect("/")
        // return res.status(401).json({error:"No attached token"})
    }
    try {
        const decoded=jwt.verify(token,process.env.SECRET_KEY)
        const id=decoded.id
        dbPool.query(selectCompId,[id],(error,result)=>{
            if(error){
                return res.status(401).json({error:error['sqlMessage']})
            }
            // if id not found
            if(result.length==0){
               return res.redirect("/")
                // return res.status(401).json({error:"Not Authenticated user"})
            }
            req.id=id
            next()
        })
        
       
    } catch (error) {
       return res.redirect("/")
        // return res.status(401).json({error:"Not Authenticated user"})
    }
}
module.exports=compAuth