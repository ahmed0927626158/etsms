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
            return res.status(200).json(result[0])
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
    
    const {id}=req.params
    
    //const {old_title,new_title}=req.body
    const {update_title}=req.body
    const company_id=req.id
    console.log(id,update_title)
    if(!update_title){
        return  res.status(400).json({error:"All fields are required"})
    }
    const selectSubject="SELECT id,title FROM subject WHERE company_id=? AND id=?"
    const updateSubject="UPDATE subject SET title=? WHERE id=?"
    dbPool.query(selectSubject,[company_id,id],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMessage']})
        }
        if(result.length==0){
            return res.status(400).json({error:"Course not found"})
        }
            dbPool.query(updateSubject,[update_title,id],(error,result)=>{
                
                if(error){
                    
                   return res.status(400).json({error:error['sqlMessage']})
                }
                if (result['changedRows'] != 1) {
                    return res.status(400).json({ error: "Course not updated" })
                }
                //return res.status(200).json({ data: "Course has been updated" })
                return res.status(200).json({data:"Family information has been updated."})
                
            })
        })
}catch(error){
    return res.status(400).json({error:error})
}
}

const deleteSubject=(req,res)=>{

    try{

const { id } = req.params

//const {title}=req.body
const company_id=req.id
const selectSubject="SELECT title FROM subject WHERE id=? AND company_id=?"
const deleteSubject="DELETE FROM subject WHERE id=?"
dbPool.query(selectSubject,[id,company_id],(error,result)=>{
    
    if(error){
        
        return res.status(400).json({error:error['sqlMessage']})
    }
    if (result.length == 0) {
        return res.status(400).json({ error: "User not found" })
    }
    
    let title=result[0]['title']
    dbPool.query(deleteSubject,[id],(error,result)=>{
        if(error){
            
        return res.status(400).json({error: error['sqlMessage']})
        }
        if (result['affectedRows'] != 1) {
            return res.status(400).json({ error: "User not deleted" })
        }
        return res.status(200).json({data: `Course ${title} deleted successfuly`})
         
    })
})
    }catch(error){
        console.log("hhhhui")
        return res.status(400).json({error: error})
    }
}

module.exports={getSubjects,getSubject,registerSubject,deleteSubject,updateSubject,getSubjectAssign}