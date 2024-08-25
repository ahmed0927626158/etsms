const dbPool=require("../config/dbConfig");
const getSubjects=(req,res)=>{
    try{
        dbPool.query(' SELECT * FROM subject',(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            return res.status(200).json({data:result})
        });
    }
    catch(error)
    {
        res.status(400).send({error:error})
    }
}
// for subject teacher and class assign
const getSubjectAssign=(req,res)=>{
    const  company_id=req.id
    try{
        dbPool.query(' SELECT s.id,s.title FROM subject AS s WHERE s.company_id=?',[company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            const data=result.map(function(subject){
                return {
                    title:subject.title,
                    id:subject.id
                }
            })
            return res.status(200).json({subject_data:data})
        });
    }
    catch(error)
    {
        res.status(400).send({error:error})
    }
}




const getSubject=(req,res)=>{
    const {id}=req.params
    try{
        const data= dbPool.query(' SELECT * FROM subject WHERE id=?',[id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            return res.status(200).json({data:result})
        });
    }
    catch(error){
        res.status(400).json({error:error})
    }
}
// register subject
const registerSubject=(req,res)=>{
const {title}=req.body;
const course_name=title.toLowerCase()
const company_id=req.id
    try{
        // Get the csubject id from grade 
        const checkSubjectQuery="SELECT title FROM subject WHERE title=? AND company_id=?"
        dbPool.query(checkSubjectQuery,[course_name,company_id],(error,result)=>{
            if(error){
                return res.status(400).json({"error":error['sqlMessage']})
            }
            // If grade exits insert grade id and subject name here
            if(result.length>0){
                return res.status(400).json({"error":"Course already exists"})
            }
            dbPool.query(' INSERT INTO subject(title,company_id)  VALUES(?,?)',[course_name,company_id],(error,result)=>{
                if(error){
                    return res.status(400).json({"error":error['sqlMessage']})
                }
                return res.status(200).json({data:result})
            });  
        })
    }
    catch(error){
        res.status(400).send({error:error})
    }
}

const updateSubject=(req,res)=>{
try{
    const {old_title,new_title}=req.body
    const company_id=req.id
    if(!old_title||!new_title){
        return  res.status(400).json({error:"All fields are required"})
    }
    const selectSubject="SELECT id,title FROM subject WHERE title=? AND company_id=?"
    const updateSubject="UPDATE subject SET title=? WHERE id=?"
    dbPool.query(selectSubject,[old_title,company_id],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMessage']})
        }
        if(result.length==0){
            return res.status(400).json({error:"Course not found"})
        }
        let subject_id=result[0]['id']
        dbPool.query(selectSubject,[new_title],(error,result)=>{
            if(error){
            return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length>0){
            return res.status(400).json({error:"Course is Already exist"})
            }
            dbPool.query(updateSubject,[new_title,subject_id],(error,result)=>{
                if(error){
                   return res.status(400).json({error:error['sqlMessage']})
                }
                if(result['changedRows']==1){
                    return res.status(200).json({data:`Course ${old_title} is changed to ${new_title}`})
                }
                else{
                   return res.status(404).json({error:"Course not changed"})
                }
            })
        })
    })
}catch(error){
    return res.status(400).json({error:error})
}
}

const deleteSubject=(req,res)=>{
    try{
const {title}=req.body
const company_id=req.id
const selectSubject="SELECT id,title FROM subject WHERE title=? AND company_id=?"
const deleteSubject="DELETE FROM subject WHERE id=?"
dbPool.query(selectSubject,[title,company_id],(error,result)=>{
    if(error){
        return res.status(400).json({error:error['sqlMessage']})
    }
    if(result.length==0){
        return res.status(400).json({error: "Course not found"})
    }
    let subject_id=result[0]['id']
    dbPool.query(deleteSubject,[subject_id],(error,result)=>{
        if(error){
        return res.status(400).json({error: error['sqlMessage']})
        }
        if(result['affectedRows']==1){
        return res.status(200).json({data: `Course ${title} deleted successfuly`})
         }
    })
})
    }catch(error){
        return res.status(400).json({error: error})
    }
}
module.exports={getSubjects,getSubject,registerSubject,deleteSubject,updateSubject,getSubjectAssign}