
const dbPool=require("../config/dbConfig")
const gradeModel=require("../models/grade.model")
const getGrades=(req,res)=>{
    const  comp_id=req.id
    try{
        dbPool.query(' SELECT id,grade,total_lt_grade FROM grade WHERE company_id=?',[comp_id],(error,result)=>{

            if(error){
                return res.status(404).send({
                    success:false,
                    "message":error
                })
            }
            return res.status(200).json({data:result})
        });
    }
    catch(error){
        res.status(400).send({error:error})
    }}

    const gradeInfo=(req,res)=>{
        const  comp_id=req.id
        try{
            dbPool.query('SELECT g.grade,g.total_lt_grade,l.letter FROM grade AS g LEFT JOIN letter_grades AS l ON l.grade_id=g.id WHERE g.company_id=?',[comp_id],(error,result)=>{
                if(error){
                    return res.status(404).send({
                        success:false,
                        "message":error
                    })
                }
                const groupedData = result.reduce((acc, curr) => {
                    const { grade, total_lt_grade, letter } = curr;
                    if (!acc[grade]) {
                      acc[grade] = { letters: '', total_lt_grade };
                    }
                    acc[grade].letters += '|'+letter;
                    return acc;
                  }, {});
                return res.status(200).json({data:[groupedData]})
            });
        }
        catch(error){
            res.status(400).send({error:error})
        }}

        

    const getGrade=(req,res)=>{
    const {id}=req.params
    const  comp_id=req.id
    try{
        const data= dbPool.query(' SELECT id,grade,total_lt_grade FROM grade WHERE id=? AND company_id=?',[id,comp_id],(error,result)=>{
            if(error){
                return res.status(404).send({
                    success:false,
                    "error":error
                })
            }
            else if(result.length==0){
                return res.status(404).send({
                    success:false,
                    "message":"Grade not found"
                })}
            return res.status(200).json({data:result})
        });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}

const registerGrade=(req,res)=>{
const {grade,total_lt_grade}=req.body;

const  comp_id=req.id
    try{
        gradeModel.getGrade(grade,comp_id).then((result)=>{
            // if the g/rade is not exixts register
            dbPool.query('INSERT INTO grade(grade,total_lt_grade,company_id)  VALUES(?,?,?)',[grade,total_lt_grade,comp_id],(error,result)=>{
                if(error){
                   
                   return res.status(400).json({error:error})
                }
                return  res.status(200).json({insertedId:result.insertId,"title":grade,"total_lt_grade":total_lt_grade}) 
            })
        }).catch((error)=>{
            return res.status(404).json({error:error})
        })
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:error})
    }
}
const updateLtterGrade=(req,res)=>{

const {grade,new_letter_grade}=req.body
try{
gradeModel.total_letter_grade(grade,new_letter_grade).then((result)=>{
    res.status(200).json({data:result})
})
}
catch(error){
res.status(500).json({"error":error})
}
}
// Update grade using id from table
const updateGrade=(req,res)=>{
    const {id,new_grade}=req.body
    const comp_id=req.id
    try{
        if(!id||!new_grade){
            return res.status(400).json({error:"All fields are required"})
        }
        else if(new_grade<0||new_grade>12){
            return res.status(400).json({error:"Grade is not valid"})
        }
        // Check if grade by using id
        let grade
    const selectQuery="SELECT grade FROM grade WHERE id=? AND company_id=?"
            dbPool.query(selectQuery,[id,comp_id],(error,result)=>{
                
                if(error){
                    return res.status(500).json({error:error})
                }
                if(result.length==0){
                   return  res.status(404).json({error:"Grade not found"})
                }
    // If grade is exist
                else{
                grade=result[0]['grade']
                // New grade and old grade is same
                if(grade===new_grade){
                    return res.status(400).json({error:"Old grade and new grade is same"})
                }
    
            const updateQuery="UPDATE grade SET grade=? WHERE id=? AND company_id=?"
            dbPool.query(updateQuery,[new_grade,id,comp_id],(error,result)=>{
                if(error){
                    return res.status(500).json({error:error})
                }
                // If no rows affected or updated
                else if(result['changedRows']==0){
                    return res.status(404).json({error:"Grade not Updated. Make shure grade exists"})
                }
                return res.status(200).json({data:result})
            })}   
            })
            
    }
    catch(error){  
    return  res.status(500).json({"error":error})        
    }
}
// Delet grade from gade table
const deleteGrade=(req,res)=>{
const {grade}=req.body
const comp_id=req.id
const deleteQuery="DELETE FROM grade WHERE grade=? AND company_id=?"
try{
dbPool.query(deleteQuery,[grade,comp_id],(error,result)=>{
    if(error){
        
        if(error['code']=='ER_ROW_IS_REFERENCED_2'){
        return res.status(400).json({error:error['sqlMessage']})
        }
        return res.status(400).json({error:"Some error occured"})
    }
    
    if(result['affectedRows']==0){
        return res.status(404).json({error:`Grade ${grade} not deleted. Make shure grade ${grade} exists`})
    }
    return res.status(200).json({data:`Grade ${grade} is deleted`})
})

}catch(error){
console.log(error)
return res.status(500).json({error:error})
}

}


module.exports={getGrades,getGrade,registerGrade,updateLtterGrade,deleteGrade,updateGrade,gradeInfo}