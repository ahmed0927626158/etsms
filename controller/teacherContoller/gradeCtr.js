const dbPool=require("../../config/dbConfig")

const getSectionOfGrade=(req,res)=>{
            const {id}=req.params
            const company_id=req.company_id
        try{    
            dbPool.query(' SELECT l.id,l.letter FROM letter_grades AS l WHERE l.grade_id=? AND l.company_id=?',[id,company_id],(error,result)=>{
                        if(error){
                            return res.status(404).send({
                                "error":error['sqlMessage']
                            })
                        }
                        else if(result.length==0){
                            return res.status(200).send({
                                data:[null]
                            })}
                           
                        return res.status(200).json({data:result})
                    });


            }
            catch(error){
                console.log(error)
                res.status(400).send({error:error})
            }
}
module.exports={getSectionOfGrade}