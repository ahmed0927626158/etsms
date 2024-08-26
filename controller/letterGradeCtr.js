const dbPool=require("../config/dbConfig")
const letterGradeModel=require("../models/letterGrade.model")
const getLetterGrades=(req,res)=>{
    const comp_id=req.id
    try{
       dbPool.query(' SELECT * FROM letter_grades WHERE company_id=?',[comp_id],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMessage']})
        }
        return res.status(200).json({data:result})
       });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}
// GET ALL section based on the class
const getSectionOfGrade=(req,res)=>{
    const {grade}=req.params
    const  comp_id=req.id
    try{
        dbPool.query('SELECT id FROM grade AS g WHERE g.grade=? AND g.company_id=? AND company_id=?',[grade,comp_id,comp_id],(error,result)=>{
            if(error){
                return res.status(404).send({
                    success:false,
                    "error":error
                })
            }
             if(result.length==0){
                return res.status(404).send({data:[null]})
            }
            let id=result[0]['id']
            dbPool.query(' SELECT l.id,l.letter FROM letter_grades AS l WHERE l.grade_id=? AND l.company_id=?',[id,comp_id],(error,result)=>{
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
        });
  
    }
    catch(error){
        res.status(400).send({error:error})
    }
}

// get all section and grade for schedule
const getSectionAndGrade=(req,res)=>{
    const {grade}=req.params
    const  comp_id=req.id
    try{
            dbPool.query(' SELECT l.id,l.letter,g.grade FROM letter_grades AS l JOIN grade AS g ON g.id=l.grade_id WHERE g.company_id=? AND l.company_id=? ',[comp_id,comp_id],(error,result)=>{
                if(error){
                    return res.status(404).send({
                        "error":error['sqlMessage']
                    })
                }
                const data=result.map(function(res){
                    return {
                        lable:res.grade +" " +res.letter,
                        id:res.id
                    }
                })
                return res.status(200).json({data:data})
            });
  
    }
    catch(error){
        res.status(400).send({error:error})
    }
}


const getLetterGrade=(req,res)=>{
    const {id}=req.params
    const comp_id=req.id
    try{
        const data=dbPool.query(' SELECT * FROM letter_grades WHERE id=? AND company_id=?',[id,comp_id],(error,result)=>{
            if(error){
                return res.status(404).json({
                    success:false,
                    "error":"Letter grade not found"
                })
            }
            return res.status(200).send(result[0])
        });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}

const registerLetterGrade=(req,res)=>{

const {letter,grade}=req.body;
const company_id=req.id
// console.log(company_id)
letterGradeModel.getLetterGradeId(grade,letter,company_id)
.then((response)=>{
    const id=response[0]['id']
            dbPool.query('INSERT INTO letter_grades(letter,grade_id,company_id) VALUES(?,?,?)',[letter,id,company_id],(error,result)=>{
                if(error){
                    return res.status(400).json({
                        "error":error['sqlMessage']
                    })
                }
                return res.status(200).send({data:"Section addeded"})
            });
        })
        .catch((error)=>{
            console.log(error)
            res.status(400).json({error:error})
        })
}
const deleteLetterGrade=(req,res)=>{
    const {letter,grade_id}=req.body
    const comp_id=req.id
    try {
        const selectQuery="SELECT id,letter FROM letter_grades WHERE letter=? AND grade_id=? AND company_id=?"
        dbPool.query(selectQuery,[letter,grade_id,comp_id],(error,result)=>{
            if(error){
                return res.status(500).json({error:error})
            }
            else if(result.length==0){
                return res.status(400).json({error:"Letter grade not found"})
            }
            else{
                const deleteSql='DELETE FROM letter_grades WHERE letter=? AND grade_id=?'
                dbPool.query(deleteSql,[letter,grade_id],(error,result)=>{
                    if(error){
                        // check if relation exit with other table
                    if(error['code']==='ER_ROW_IS_REFERENCED_2'){
                    return res.status(400).json({error:error['sqlMessage']})
                        }
                    }
                    if(result['affectedRows']==1){
                        // if letter grade is delet select grade whose letter grade is deleted
                          const selectGradeSql='SELECT grade FROM grade  WHERE id=?'
                         
                          dbPool.query(selectGradeSql,[grade_id],(error,result)=>{
                            console.log(error)
                            if(!error){
                                return res.status(200).json({data:`letter grade ${letter} for grade ${result[0]['grade']} is deleted`})
                            }
                            return res.status(400).json({error:error['sqlMessage']})

                          })
                    }
                })
            }

        })
    } catch (error) {
        return res.status(500).json({error:error})
    }
}
module.exports={getLetterGrade,getLetterGrades,registerLetterGrade,deleteLetterGrade,getSectionOfGrade,getSectionAndGrade}