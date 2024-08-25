
const bcrypt=require("bcrypt")
const dbPool=require("../config/dbConfig")
const {sendEmail}=require("../utils/sendMaile")
const generatePassword=require("../utils/generatePassword")

const getTechers=(req,res)=>{
    try{
        dbPool.query(' SELECT t.id, t.firstname,t.middlename,t.lastname,t.phone FROM techer AS t',(error,result)=>{
            if(error){
                    return res.status(400).json({error:error['sqlMessage']})
                }
            if(result.length==0){
                return res.status(400).json({error:"teacher not found"})
            }
            var data = result.map(function(teacher) {
                return {
                    readable: teacher.firstname + ' ' + teacher.middlename + ' ' + teacher.lastname + ' ' + teacher.phone,
                    id:teacher.id
                };
            });
            return res.status(200).json({data:data})    
            });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}


const getTecher=(req,res)=>{
    const {id}=req.params

    try{
        dbPool.query(' SELECT * FROM techer WHERE id=?',[id],(error,result)=>{
        if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
        if(result.length==0){
            return res.status(400).json({error:"user not found"})
        }
       
        return res.status(200).json({data:result})
        
        });
       
    }
    catch(error){
        res.status(400).send({error:error})
    }
}

// get teacher to link with subject and others

const getSchoolTeacherForLink=(req,res)=>{
    const company_id=req.id
    try{
         dbPool.query('SELECT t.id,t.firstname,t.middlename,t.lastname,t.phone,t.email FROM techer AS t JOIN company AS com ON t.company_id=com.id WHERE com.id=? AND t.company_id=?',[company_id,company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
        if(result.length==0){
            return res.status(400).json({error:"Family not found"})
        }
        var data = result.map(function(item) {
            return {
                label: item.firstname + ' ' + item.middlename + ' ' + item.lastname + ' '+ item.phone + ' ' + item.email,
                value:item.id
            };
        });
        return res.status(200).json({data:data})
        });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}
const registerTecher=(req,res)=>{
const {firstname,middlename,lastname,phone,email,gender,level,study}=req.body;
const comp_id=req.id
const password=generatePassword(8)
const password_status="new"
const status="open"
    try{
        const selectQuery="SELECT phone,email FROM techer WHERE phone=? OR email=?"
        const insertTeacherQuery="INSERT INTO techer(firstname,middlename,lastname,phone,email,gender,level,study,company_id,password,password_status,account_status)  VALUES(?,?,?,?,?,?,?,?,?,?,?,?)"
        dbPool.query(selectQuery,[phone,email], async(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            // check if the user is registered before
            if(result.length>0){
                return res.status(400).json({error:"This user is already registered"})
            }
            // if user not exist register here
           
          
            const hashPassword= await bcrypt.hash(password,10)
            // console.log(hashPassword)
            dbPool.query(insertTeacherQuery, [firstname,middlename,lastname,phone,email,gender,level,study,comp_id,hashPassword,password_status,status],async(error,result)=>{
                if(error){
                    
                    return res.status(400).json({error:error['sqlMessage']})
                }
           const mailResponse= await sendEmail(email,'This is your first password for EtSMS',`Hello Mr ${firstname} this ${password} is your schoole login password don't share anyone  `)
             console.log(mailResponse)
           return res.status(200).send({data:{"firstname":firstname,"phone":phone,"email":email}})

            });
        })
    }
    catch(error){
        res.status(400).send({error:error})
    }
}
const updateTechear=(req,res)=>{
    
    try {
        const {id}=req.params
        const {firstname,middlename,lastname,phone,email,gender,level,study}=req.body;
        const selectQuery="SELECT id FROM techer WHERE id=?"
        const updateQuery="UPDATE techer SET firstname=?,middlename=?,lastname=?,phone=?,email=?,gender=?,level=?,study=? WHERE id=?"
        dbPool.query(selectQuery,[id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(400).json({error:"User not found"})
            }
            dbPool.query(updateQuery,[firstname,middlename,lastname,phone,email,gender,level,study,id],(error,result)=>{
                if(error){
                return res.status(400).json({error:error['sqlMessage']})
                }
                if(result['changedRows']!=1){
                return res.status(400).json({error:"User not updated"})
                }
                return res.status(200).json({data:"User updated successfuly"})

            })
        })

    } catch (error) {
        res.status(400).send({error:error})   
    }
}
const deleteTeacher=(req,res)=>{
    try {
        const {id}=req.params
        const deleteQuery="DELETE FROM techer WHERE id=?"
        dbPool.query(deleteQuery,[id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result['affectedRows']!=1){
                return res.status(400).json({error:"User not deleted"})
            }
            return res.status(200).json({data:"User deleted successfuly"})

        })
    } catch (error) {
        return res.status(400).json({error:error})
    }
}
module.exports={getTecher,getTechers,registerTecher,updateTechear,deleteTeacher,getSchoolTeacherForLink}