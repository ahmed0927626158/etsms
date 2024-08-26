
const dbPool=require("../config/dbConfig")
const family_student_model=require("../models/student.family.model")
const getFamilyStudents=(req,res)=>{
const allFamilyStudentQuery="SELECT fs.id,f.firstname AS family_firstname,f.middlename AS family_middlename,f.lastname AS family_lastname,f.phone AS family_phone,f.email AS family_email,s.firstname AS student_firstname,s.middlename AS student_middlename,s.lastname AS student_lastname, l.letter ,g.grade FROM family_student AS fs JOIN family AS f ON fs.family_id=f.id JOIN student AS s ON fs.student_id=s.id JOIN letter_grades AS l ON s.letter_grade_id=l.id JOIN grade AS g ON l.grade_id=g.id"
    try{
        dbPool.query(allFamilyStudentQuery,(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(400).json({error:"No family registered"})
            }
            console.log(result)
            
            return res.status(200).json({data:result})
        });   
    }
    catch(error){
        res.status(400).send({error:error})
    }
}



const getFamilyStudent=(req,res)=>{
    const {id}=req.params
    
const familyStudent="SELECT fs.id,f.firstname AS family_firstname,f.middlename AS family_middlename,f.lastname AS family_lastname,f.gender AS family_gender,f.phone AS family_phone,f.email AS family_email,f.address AS family_address,s.firstname AS student_firstname,s.middlename AS student_middlename,s.lastname AS student_lastname, l.letter ,g.grade FROM family_student AS fs JOIN family AS f ON fs.family_id=f.id JOIN student AS s ON fs.student_id=s.id JOIN letter_grades AS l ON s.letter_grade_id=l.id JOIN grade AS g ON l.grade_id=g.id WHERE fs.id=?"
    try{
      dbPool.query(familyStudent,[id],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMessage']})
        }
        if(result.length==0){
            return res.status(400).json({error:"This family  not registered"})
        }
        
        return res.status(200).json(result[0])
      });   
    }
    catch(error){
        res.status(400).send({error:error})
    }

}

const registerFamilyStudent=(req,res)=>{
const {family_id,student_id}=req.body;
const insertQuery='INSERT INTO family_student(family_id,student_id)  VALUES(?,?)'
    try{
          family_student_model.getFamilyStudent(family_id,student_id)
          .then((response)=>{
            dbPool.query(insertQuery,[family_id,student_id],(error,result)=>{
                if(error){
                    return res.status(400).json({error:error['sqlMessage']})
                }
                return res.status(200).json({data:result})
            });
          }).catch((error)=>{
           
            return res.status(400).json({error:error})
          }) 
    }
    catch(error){
        res.status(400).send({error:error})
    }
}
const updateFamilyStudent=(req,res)=>{
const  {id}=req.params
const {student_id,family_id}=req.body
const checkFamilyStudent="SELECT id FROM family_student WHERE id=?"
const updateFamilyStudent="UPDATE family_student SET family_id=?, student_id=? WHERE id=?"
const getFamilyStudentInfo="SELECT f.firstname AS father_firstname,f.middlename AS father_middlename,f.lastname AS father_lastname,s.firstname AS student_firstname,s.middlename AS student_middlename,s.lastname AS student_lastname FROM family_student AS fs JOIN student AS s ON fs.student_id=s.id JOIN family AS f ON fs.family_id=f.id WHERE fs.id=?"
    
dbPool.query(checkFamilyStudent,[id],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMessage']})
        }
        if(result.length==0){
            return res.status(404).json({error:"Family Student link not found"})
        }
        // call family_student_model to chech family and student and their relation
        family_student_model.getFamilyStudent(family_id,student_id)
        .then((response)=>{
            dbPool.query(updateFamilyStudent,[family_id,student_id,id],(error,result)=>{
                if(error){
            return res.status(400).json({error:error['sqlMessage']})
                }
            dbPool.query(getFamilyStudentInfo,[id],(error,result)=>{
                if(error){
            return res.status(400).json({error:error['sqlMessage']})
                }
                return res.status(200).json({data:result})
            })
            })
        })
        .catch(error=>{
            return res.status(400).json({error:error})
        })
    })
}
const deleteFamilyStudent=(req,res)=>{
const {id}=req.body
try {
    
} catch (error) {
    
}
}
 
module.exports={getFamilyStudent,getFamilyStudents,registerFamilyStudent,updateFamilyStudent,deleteFamilyStudent}