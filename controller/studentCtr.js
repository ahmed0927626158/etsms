const { v4:uuidv4 } =require('uuid');
const dbPool=require("../config/dbConfig");

const getStudents=(req,res)=>{
    const company_id=req.id
    try{
         dbPool.query(' SELECT * FROM student WHERE company_id=?',[company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
        if(result.length==0){
            return res.status(400).json({error:"Student not found"})
        }
        return res.status(200).json({data:result})
        });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}

// select all student  for family
const getSchoolStudentsForLink=(req,res)=>{
    const {grade,section}=req.query  
    const company_id=req.id
    try{
        dbPool.query('SELECT s.id,s.firstname,s.middlename,g.grade,l.letter FROM student AS s JOIN letter_grades AS l ON s.letter_grade_id=l.id JOIN grade AS g ON l.grade_id=g.id WHERE s.company_id=? AND g.company_id=? AND l.company_id=? AND g.grade=? AND l.id=?',[company_id,company_id,company_id,grade,section],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
        if(result.length==0){
            return res.status(400).json({error:"Student not found"})
        }
        var data = result.map(function(item) {
            return {
                label: item.firstname + ' ' + item.middlename + ' ' + item.grade + ' ' + item.letter,
                value:item.id
            };
        });
        return res.status(200).json({data:data})

        });

    //     if(grade==undefined && section==undefined){
    //      dbPool.query('SELECT s.id,s.firstname,s.middlename,g.grade,l.letter FROM student AS s JOIN letter_grades AS l ON s.letter_grade_id=l.id JOIN grade AS g ON l.grade_id=g.id WHERE s.company_id=? AND g.company_id=? AND l.company_id=?',[company_id,company_id,company_id],(error,result)=>{
    //         if(error){
    //             return res.status(400).json({error:error['sqlMessage']})
    //         }
    //     if(result.length==0){
    //         return res.status(400).json({error:"Student not found"})
    //     }
    //     var data = result.map(function(item) {
    //         return {
    //             label: item.firstname + ' ' + item.middlename + ' ' + item.grade + ' ' + item.letter,
    //             value:item.id
    //         };
    //     });
    //     return res.status(200).json({data:data})

    //     });
    // }
    // else if(grade!=undefined && section==undefined){
    //     dbPool.query('SELECT s.id,s.firstname,s.middlename,g.grade,l.letter FROM student AS s JOIN letter_grades AS l ON s.letter_grade_id=l.id JOIN grade AS g ON l.grade_id=g.id WHERE s.company_id=? AND g.company_id=? AND l.company_id=? AND g.grade=?',[company_id,company_id,company_id,grade],(error,result)=>{
    //         if(error){
    //             return res.status(400).json({error:error['sqlMessage']})
    //         }
    //     if(result.length==0){
    //         return res.status(400).json({error:"Student not found"})
    //     }
    //     var data = result.map(function(item) {
    //         return {
    //             label: item.firstname + ' ' + item.middlename + ' ' + item.grade + ' ' + item.letter,
    //             value:item.id
    //         };
    //     });
    //     return res.status(200).json({data:data})
    //     });
    // }
    // else if(grade!=undefined && section!=undefined){



    // }
    }
    catch(error){
        res.status(400).send({error:error})
    }
}



const getStudent=(req,res)=>{
    const company_id=req.id
    const {id}=req.params
    try{
        dbPool.query(' SELECT * FROM student WHERE id=? AND company_id=?',[id,company_id],(error,result)=>{
         if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
        if(result.length==0){
            return res.status(400).json({error:"No found"})
        }
        return res.status(200).json({data:result})
        });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}

function generatePassword(){
    const password=uuidv4();
    return password

}
const registerStudent=(req,res)=>{
const {firstname,middlename,lastname,gender,birthdate,address,letter_grade_id}=req.body;
const company_id=req.id
const password=generatePassword();
const insertQuery="INSERT INTO student(firstname,middlename,lastname,gender,birthdate,address,company_id,letter_grade_id,password)  VALUES(?,?,?,?,?,?,?,?,?)"
    try{
        dbPool.query(insertQuery,[firstname,middlename,lastname,gender,birthdate,address,company_id,letter_grade_id,password],(error,result)=>{
        if(error){
                return res.status(400).json({error:error['sqlMessage']})
        }
        return  res.status(200).json({insertedId:result.insertId,"firstname":firstname,"middlename":middlename}) 
       });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}
// Update student 
const updateStudent=(req,res)=>{
    const company_id=req.id
       const selectQuery="SELECT id FROM student WHERE id=? AND company_id=?"
        const updateQuery="UPDATE student SET firstname=?,middlename=?,lastname=?,gender=?,address=?,letter_grade_id=? WHERE company_id=?"
    try {
        const {id}=req.params
        const {firstname,middlename,lastname,gender,address,letter_grade_id}=req.body;
        // Check student if registered
        dbPool.query(selectQuery,[id,company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(400).json({error:"Student not found"})
            }
            // Update student
            dbPool.query(updateQuery,[firstname,middlename,lastname,gender,address,letter_grade_id,company_id],(error,result)=>{
                if(error){
                return res.status(400).json({error:error['sqlMessage']})
                }
                if(result['changedRows']!=1){
                return res.status(400).json({error:"Student not updated"})
                }
                return res.status(200).json({data:"student updated"})
            })
        })
        
    } catch (error) {
        res.status(400).send({error:error})  
    }
}
const deleteStudent=(req,res)=>{
    const selectQuery="SELECT firstname,middlename,id FROM student WHERE id=? AND company_id=?"
    const deleteQuery="DELETE FROM student WHERE id=? AND company_id=?"
    let firstname,lastname
    try{
const {id}=req.params
// Check is student exist
dbPool.query(selectQuery,[id,company_id],(error,result)=>{
    if(error){
        return res.status(400).json({error:error['sqlMessage']})
    }
    if(result.length==0){
        return res.status(400).json({error:"Student not registered"})
    }
    firstname=result[0]['firstname']
    middlename=result[0]['middlename']
    // delete student if exist
    dbPool.query(deleteQuery,[id,company_id],(error,result)=>{
    if(error){
        return res.status(400).json({error:error['sqlMessage']})
        }
    if(result['affectedRows']==0){
        return res.status(400).json({error:`Student ${firstname} ${middlename} not deleted`})
        }
        return res.status(200).json({data:`Student ${firstname} ${middlename} is deleted`})
    })
})
    }catch(error){
        res.status(400).send({error:error})  
    }
}
module.exports={getStudents,getStudent,registerStudent,updateStudent,deleteStudent,getSchoolStudentsForLink}