
const dbPool=require("../../config/dbConfig")

const getSubjectOfSection=(req,res)=>{
            const {id}=req.params
            const teacher_id=req.id
        try{    
            dbPool.query(' SELECT sb.id,sb.title FROM techer_course_grade AS tcg JOIN letter_grades as l ON l.id=tcg.letter_grade_id JOIN subject as sb ON tcg.subject_id=sb.id WHERE l.id=? AND tcg.techer_id=?',[id,teacher_id],(error,result)=>{
                        if(error){
                            return res.status(404).send({
                                "error":error['sqlMessage']
                            })
                        }
                        
                        return res.status(200).json({data:result})
                    });
            }
            catch(error){
               
                res.status(400).send({error:error})
            }
}

const getSectionStudents=(req,res)=>{
    const {id}=req.params
    const company_id=req.company_id
try{    
    dbPool.query(' SELECT id,firstname,middlename,lastname FROM student WHERE letter_grade_id=? AND company_id=?',[id,company_id],(error,result)=>{
                if(error){
                    return res.status(404).send({
                        "error":error['sqlMessage']
                    })
                }
               
                return res.status(200).json({data:result})
            });
    }
    catch(error){
        
        res.status(400).send({error:error})
    }
}
module.exports={getSubjectOfSection,getSectionStudents}