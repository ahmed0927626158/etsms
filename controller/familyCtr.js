
const { v4:uuidv4 } =require('uuid');
const dbPool=require("../config/dbConfig")

const getFamliys=(req,res)=>{
const company_id=req.id
    try{
        const data= dbPool.query('SELECT * FROM family WHERE company_id=?',[company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(400).json({error:"No registered students"})
            }
            return res.status(200).json({data:result})
        });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}



const getFamliy=(req,res)=>{
    const {id}=req.params
    try{
        dbPool.query(' SELECT * FROM family WHERE id=?',[id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(400).json({error:"Family Not found"})
            }
            return res.status(200).json(result[0])
        });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}


const getSchoolFamilyForLink=(req,res)=>{
    const company_id=req.id
    try{
         dbPool.query('SELECT f.id,f.firstname,f.middlename,f.phone,f.email FROM family AS f JOIN company AS com ON f.company_id=com.id WHERE com.id=? AND f.company_id=?',[company_id,company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
        if(result.length==0){
            return res.status(400).json({error:"Family not found"})
        }
        var data = result.map(function(item) {
            return {
                label: item.firstname + ' ' + item.middlename + ' ' + item.phone + ' ' + item.email,
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

function generatePassword(){
    const password=uuidv4();
    return password

}
const registerFamily=(req,res)=>{
    
  const company_id=req.id
const {firstname,middlename,lastname,gender,phone,email,address}=req.body;
const password=generatePassword();
const password_status="new"
const status="open"

const selectQuery="SELECT phone,company_id FROM family WHERE phone=? AND company_id=?"
const insertQuery="INSERT INTO family(firstname,middlename,lastname,gender,phone,email,address,company_id,password,password_status,status)  VALUES(?,?,?,?,?,?,?,?,?,?,?)"
    try{
        // Check if family registered before
       
        dbPool.query(selectQuery,[phone,company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length>0){
                    return res.status(400).json({error:"User already registered"})
            }
            
            // registere family here if not found
            dbPool.query(insertQuery,
                [firstname,middlename,lastname,gender,phone,email,address,company_id,password,password_status,status],(error,result)=>{
                    if(error){
                        return res.status(400).json({error:error['sqlMessage']})
                    }
                    
                return  res.status(200).json({insertedId:result.insertId,"firstname":firstname,"middlename":middlename,"phone":phone}) 
                });
        })       
    }
    catch(error){
        
       return res.status(400).send({error:error})
    }
}


const updateFamily=(req,res)=>{
    const selectQuery="SELECT id FROM family WHERE id=?"
    const updateQuery="UPDATE family SET firstname=?,middlename=?,lastname=?,gender=?,phone=?,address=? WHERE id=?"
try {
    const {id}=req.params
    const {firstname,middlename,lastname,gender,phone,address}=req.body;
    // Check student if registered
    dbPool.query(selectQuery,[id],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMessage']})
        }
        if(result.length==0){
            return res.status(400).json({error:"Family not found"})
        }
        // Update student
        dbPool.query(updateQuery,[firstname,middlename,lastname,gender,phone,address,id],(error,result)=>{
            if(error){
            return res.status(400).json({error:error['sqlMessage']})
            }
            if(result['changedRows']!=1){
            return res.status(400).json({error:"No family information has been updated.Please Try again!"})
            }
            return res.status(200).json({data:"Family information has been updated."})
        })
    })
} catch (error) {
    res.status(400).send({error:error})  
}
}
const deleteFamily=(req,res)=>{
    const selectQuery="SELECT firstname,middlename,id FROM family WHERE id=?"
    const deleteQuery="DELETE FROM family WHERE id=?"
    let firstname,middlename
    try{
const {id}=req.params
// Check is Family exist
dbPool.query(selectQuery,[id],(error,result)=>{
    if(error){
        return res.status(400).json({error:error['sqlMessage']})
    }
    if(result.length==0){
        return res.status(400).json({error:"Family not registered"})
    }
    firstname=result[0]['firstname']
    middlename=result[0]['middlename']
    // delete Family if exist
    dbPool.query(deleteQuery,[id],(error,result)=>{
    if(error){
        return res.status(400).json({error:error['sqlMessage']})
        }
    if(result['affectedRows']==0){
        return res.status(400).json({error:`Family ${firstname} ${middlename} not deleted`})
        }
        return res.status(200).json({data:`Family ${firstname} ${middlename} is deleted`})
    })
})
    }catch(error){
        res.status(400).send({error:error})  
    }
}
module.exports={getFamliy,getFamliys,registerFamily,updateFamily,deleteFamily,getSchoolFamilyForLink}