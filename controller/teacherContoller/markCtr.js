
const dbPool=require("../../config/dbConfig")

const getMarkTyps=(req,res)=>{
            const company_id=req.company_id
        try{    
            dbPool.query(' SELECT id,name,percent FROM mark_type WHERE company_id=?',[company_id],(error,result)=>{
                        if(error){
                            return res.status(404).send({
                                "error":error['sqlMessage']
                            })
                        }
                        console.log(result)
                        return res.status(200).json({data:result})
                    });
            }
            catch(error){
                console.log(error)
                res.status(400).send({error:error})
            }
}
module.exports={getMarkTyps}