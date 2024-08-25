
const dbPool=require("../config/dbConfig")
const selectStudent="SELECT id FROM student WHERE id=?"
const selectFamily="SELECT id FROM family WHERE id=?"
const selectQuery="SELECT f.firstname AS ffname,f.middlename AS fmname,s.firstname,s.middlename FROM family_student AS fs JOIN family AS f ON f.id=fs.family_id JOIN student AS s ON fs.student_id=s.id WHERE family_id=? AND student_id=?"
   
const family_student={
getFamilyStudent:(family_id,student_id)=>{
    return new Promise((resolve,reject)=>{
        dbPool.query(selectStudent,[student_id],(error,result)=>{
            if(error){
                reject(error['sqlMessage'])
            }
            if(result.length==0){
                reject("Student not registered")
            }
            dbPool.query(selectFamily,[family_id],(error,result)=>{
                if(error){
                    reject(error['sqlMessage'])
                }
                if(result.length==0){
                    reject("Family not registered")
                }
            
           dbPool.query(selectQuery,[family_id,student_id],(error,result)=>{
            if(error){
                
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length>0){
                const ffname=result[0]['ffname']
                const fmname=result[0]['fmname']
                const sfirstname=result[0]['firstname']
                const smiddlename=result[0]['ffname']
                reject(`Family ${ffname} ${fmname} with student ${sfirstname} ${smiddlename} registered before`)
            }
            resolve("query enable")
            }) 
            })
        })
    })
}

}
module.exports=family_student