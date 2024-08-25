const dbPool=require("../config/dbConfig")
const gradeSubjectModel={
    addGradeCourse:(grade_id,subject_id)=>{
        return new Promise((resolve,reject)=>{
            // check if grade subject exist before
            const selectGradeSubject="SELECT grade_id,subject_id FROM grade_subject WHERE grade_id=? AND subject_id=?"
            dbPool.query(selectGradeSubject,[grade_id,subject_id],(error,result)=>{
                if(error){
                    reject(error['sqlMessage'])
                }
                // Reject if already exist
                if(result.length>0){
                    reject("Already exist")
                }
                else{
                    // If grade is not exit before add to table
                    const insertSql="INSERT INTO grade_subject(subject_id,grade_id) VALUES(?,?)"
                    dbPool.query(insertSql,[subject_id,grade_id],(error,result)=>{
                        if(error){
                            reject(error['sqlMessage'])
                        }
                        resolve(result)
                    })
                }
            })

        })
    }
}
module.exports=gradeSubjectModel