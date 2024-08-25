
const dbPool=require("../config/dbConfig")
const gradeModel=require("../models/grade.model")
const generatePassword=require("../utils/generatePassword")
const {sendEmailPassword}=require("../utils/sendMaile")
const  { v4: uuidv4 } = require('uuid');
const bcrypt=require("bcrypt")
const getGrades=(req,res)=>{
    try{
        const data= dbPool.query(' SELECT * FROM grade',(error,result)=>{
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



const getGrade=(req,res)=>{
    const {id}=req.params
    try{
        const data= dbPool.query(' SELECT * FROM grade WHERE id=?',[id],(error,result)=>{
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

const registerCompny=(req,res)=>{
const comp_id=uuidv4()
const password=generatePassword(8)
const status="open"
const {name,email,phone}=req.body;
const pass_status="new"
const insertQuery="INSERT INTO company(id,name,email,phone,password,password_status,account_status)  VALUES(?,?,?,?,?,?,?)"
    try{
            // if the g/rade is not exixts register
            dbPool.query(insertQuery,[comp_id,name,email,phone,password,pass_status,status],(error,result)=>{
                if(error){
                    throw(error)
                }
                
           const mailResponse=sendEmailPassword(email,"This is your first password for EtSMS",`Please use this password for your school and don't share to anyone and update soon ${password} `)
            return  res.status(200).json({insertedId:result.insertId,"id":comp_id,"name":name,"email":email,"phone":phone}) 
        
        // }).catch((error)=>{
        //     console.log(error)
        //     return res.status(400).json({error:error})
     })
    }
    catch(error){
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
    try{
        if(!id||!new_grade){
            return res.status(400).json({error:"All fields are required"})
        }
        else if(new_grade<0||new_grade>12){
            return res.status(400).json({error:"Grade is not valid"})
        }
        // Check if grade by using id
        let grade
    const selectQuery="SELECT grade FROM grade WHERE id=?"
            dbPool.query(selectQuery,[id],(error,result)=>{
                
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
    
            const updateQuery="UPDATE grade SET grade=? WHERE id=?"
            dbPool.query(updateQuery,[new_grade,id],(error,result)=>{
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
const deleteQuery="DELETE FROM grade WHERE grade=?"
try{
dbPool.query(deleteQuery,[grade],(error,result)=>{
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


module.exports={getGrades,getGrade,registerCompny,updateLtterGrade,deleteGrade,updateGrade}