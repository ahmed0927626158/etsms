
const dbPool=require("../config/dbConfig")
const gradeModel=require("../models/grade.model")
const getMarks=(req,res)=>{
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

        

    const getMark=(req,res)=>{
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

const registerMark=(req,res)=>{
const {name,percent}=req.body;
const amount= parseInt(percent,10) 
const  company_id=req.id
const selectMark="SELECT name from mark_type WHERE name=? AND company_id=?"
const countPercent="SELECT sum(percent) as percent FROM mark_type WHERE company_id=?"
const insertMark='INSERT INTO mark_type(name,percent,company_id) VALUES(?,?,?)'
    try{
        dbPool.query(selectMark,[name,company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
              }
            if(result.length>0){
                return res.status(400).json({error:"Mark already exist"})
             }
            dbPool.query(countPercent,[company_id],(error,result)=>{
                if(error){
                    return res.status(400).json({error:error['sqlMessage']})
                  }
                const totale_percent=result[0]['percent']
 
            const sum_mark=parseInt(totale_percent,10)+amount
        //    check if the existing and new curernt mark not greater than 100
            if(sum_mark>100){
                console.log(true)
                return res.status(400).json({error:`You can't add this mark you only left ${100-parseInt(totale_percent,10)}`})
            }
            
            dbPool.query(insertMark,[name,amount,company_id],(error,result)=>{
                if(error){
                    console.log(error)
                    return res.status(400).json({error:error['sqlMessage']})
            } 
                    return res.status(200).json({data:`${name} out of ${percent} added`})
            })
            })
        })
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:error})
    }
}

// Update grade using id from table
const updateMark=(req,res)=>{
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
const deleteMark=(req,res)=>{
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


module.exports={getMark,getMarks,registerMark,updateMark,deleteMark}