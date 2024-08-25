const dbPool=require("../config/dbConfig")
const gradeSubjectModel=require("../models/grade.subject.model")
const registerSubject=(req,res)=>{
    const {title,grade}=req.body;
    
        try{
            // Get the subject id from grade 
            let subject_id,grade_id
            const selectGradeQuery="SELECT id FROM grade WHERE grade=?"
            dbPool.query(selectGradeQuery,[grade],(error,result)=>{
                if(error){
                    return res.status(400).json({"error":error['sqlMessage']})
                }
                // If grade exits insert grade id and subject name here
                 grade_id=result[0]['id']
                const selectSubject="SELECT id FROM subject WHERE title=?"
                console.log(title)
                dbPool.query(selectSubject,[title],(error,result)=>{
                    if(error){
                        
                        return res.status(400).json({"error":error['sqlMessage']})
                    }
                    
                    subject_id=result[0]['id']
                    // call grade_subject model to insert
                    gradeSubjectModel.addGradeCourse(grade_id,subject_id).then((result)=>{
                        return res.status(200).json({data:result})
                    }).catch((error)=>{
                        console.log(error)
                        return res.status(400).json({error:error})
                    })
                }); 
            })
        }
        catch(error){
            console.log(error)
            res.status(400).json({error:error})
        }
    }

    const deleteSubjectGrade=(req,res)=>{
        try{
        const {grade,title}=req.body
        const selectGradeId="SELECT id FROM grade WHERE grade=?"
        const selectSubjectId="SELECT id FROM subject WHERE title=?"
        const deleteSubjectGrade="DELETE FROM grade_subject WHERE grade_id=? AND subject_id=?"
        let grade_id,subject_id
        dbPool.query(selectGradeId,[grade],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(400).json({error:"Grade is not found"})
            }
            grade_id=result[0]['id']
            // get id of course 
            dbPool.query(selectSubjectId,[title],(error,result)=>{
                if(error){
                return res.status(400).json({error:error['sqlMessage']})
                }
               else if(result.length==0){
                    return res.status(400).json({error:"Course is not found"})
                }
                subject_id=result[0]['id']
                // if course and grade exist now delete it
                dbPool.query(deleteSubjectGrade,[grade_id,subject_id],(error,result)=>{
                    if(error){
                       return res.status(400).json({error:error['sqlMessage']})
                    }
                    if(result['affectedRows']==0){
                       return res.status(400).json({error:"Course Subject is not deleted"})
                    }
                    if(result['affectedRows']==1){ 
                        return res.status(400).json({data:"Course Subject is deleted"})
                     }
                })
            })
        })
        }
        catch(error){

        }

    }
    module.exports={registerSubject,deleteSubjectGrade}