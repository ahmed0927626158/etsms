const dbPool=require("../config/dbConfig")
const getScheduleParts=(req,res)=>{
    try{
     dbPool.query(' SELECT * FROM schedul_part',(error,result)=>{
        if(error){
            return res.status(404).json({error:error})
        }
        return res.status(200).json({data:result})
     });}
    catch(error){
        res.status(400).send({error:error})
    }}


const getSchedulePart=(req,res)=>{
    const {id}=req.params
    try{
        dbPool.query(' SELECT * FROM schedul_part WHERE id=?',[id],(error,result)=>{
            if(error){
                return res.status(404).json({error:error})
            }
            return res.status(200).json({data:result})
         });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}

const registerSchedulePart=(req,res)=>{
const company_id=req.id
const {schedul_id,teacher_id,subject_id,schedule_time_id}=req.body;
const insertQuery='INSERT INTO schedul_part(schedul_id,techer_id,subject_id,schedule_time_id,company_id)  VALUES(?,?,?,?,?)'
const selectScheduleLetterGrade='SELECT sp.*,st.id,TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time,l.*, g.grade,sb.title,s.day_title FROM schedul_part AS sp JOIN schedule_time AS st ON sp.schedule_time_id=st.id JOIN schedul AS s ON  sp.schedul_id=s.id JOIN letter_grades AS l ON  s.letter_grade_id=l.id  JOIN grade  AS g ON l.grade_id=g.id JOIN subject as sb ON sb.id=sp.subject_id JOIN company AS com ON sp.company_id=com.id WHERE schedul_id=? AND schedule_time_id=?'
const selectTeacherSubject="SELECT tcg.*,t.firstname,t.middlename,sb.title FROM techer_course_grade AS tcg JOIN techer AS t ON t.id=tcg.techer_id JOIN subject AS sb ON tcg.subject_id=sb.id WHERE t.id=? AND subject_id=? AND t.company_id=? AND sb.company_id=?"
const selectCheckTeacherSchedul='SELECT sp.schedul_id,g.grade,l.letter,t.firstname,t.middlename,s.day_title,TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time FROM schedul_part AS sp JOIN schedul AS s ON sp.schedul_id=s.id JOIN techer AS t ON sp.techer_id=t.id JOIN schedule_time AS st ON st.id=sp.schedule_time_id JOIN letter_grades AS l ON s.letter_grade_id=l.id JOIN grade AS g ON g.id=l.grade_id JOIN company AS com ON com.id=sp.company_id  WHERE techer_id=? AND schedul_id=?  AND schedule_time_id=? AND s.company_id=?'
const checkAllDataCompany='SELECT t.firstname,t.lastname,sb.title,TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time FROM techer AS t JOIN subject AS sb ON sb.company_id=t.company_id JOIN schedul AS s ON s.company_id=t.company_id JOIN schedule_time AS st ON st.company_id=s.company_id WHERE t.id=? AND sb.id=? AND s.id=? AND st.id=?'
const checkGradeSubhjectTeacherAssign="SELECT t.id AS techer_id, t.firstname,t.lastname,l.letter,g.grade,sb.title FROM techer_course_grade AS tcg JOIN techer AS t ON t.id=tcg.techer_id JOIN subject AS sb ON sb.id=tcg.subject_id JOIN letter_grades AS l ON l.id=tcg.letter_grade_id JOIN grade AS g ON g.id=l.grade_id WHERE  t.id=? AND sb.id=? AND t.company_id=? AND sb.company_id=? AND l.company_id=?"   
try{
        // check if all incoming data is on the same schoolse
        dbPool.query(checkAllDataCompany,[teacher_id,subject_id,schedul_id,schedule_time_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(404).json({error:"All data is not found at this schoole"})
            }
                    // check if teacher seted for the course before register schedule
        dbPool.query(checkGradeSubhjectTeacherAssign,[teacher_id,subject_id,company_id,company_id,company_id],(error,result)=>{
            if(error){
                console.log(error)
                return res.status(404).json({error:error['sqlMessage']})
            }
            // check if grade section with subject assigned for a teacher before
            if(result.length>0 && result[0]['techer_id']!=teacher_id){
            return res.status(404).json({error:`Mr ${result[0]['firstname']}  ${result[0]['lastname']} is assigned for grade ${result[0]['grade']} ${result[0]['letter']} for subject ${result[0]['title']} `})
                } 
            // chech teacher if free on that schedule date and time
            dbPool.query(selectCheckTeacherSchedul,[teacher_id,schedul_id,schedule_time_id,company_id],(error,result)=>{
                if(error){
                    return res.status(400).json({error:error['sqlMessage']})
                }
               if(result.length>0){
                const firstname=result[0]['firstname']
                const middlename=result[0]['middlename']
                console.log(result)
                const day=result[0]['day_title']
                const grade=result[0]['grade']
                const gradeLetter=result[0]['letter']
                const start_time=result[0]['start_time']
                const end_time=result[0]['end_time']
                   return res.status(400).json({error:`${firstname } ${middlename} on ${day} has a class at Grade ${grade} ${gradeLetter} from ${start_time} to ${end_time}`})
               }
            //    check if grade is free on that date and time
                dbPool.query(selectScheduleLetterGrade,[schedul_id,schedule_time_id],(error,result)=>{
                    if(error){
                        return res.status(404).json({error:error['sqlMessage']})
                    }
                    if(result.length>0){
                        const grade=result[0]['grade']
                        const gclass=result[0]['letter']
                        const day=result[0]['day_title']
                        const subject=result[0]['title']
                        const start_time=result[0]['start_time']
                        const end_time=result[0]['end_time']
                        return res.status(400).json({error:`Grade ${grade} ${gclass} on ${day} from ${start_time} to ${end_time} has  ${subject} class and is not free`})
                    }
        // if above requirements are fulfiled insert schedule
                dbPool.query(insertQuery,[schedul_id,teacher_id,subject_id,schedule_time_id,company_id],(error,result)=>{
                    if(error){
                        return res.status(404).json({error:error['sqlMessage']})
                    }
                    return res.status(200).json({data:result})
                });
                })
            })
            
        })


        })

  }
    catch(error){
        res.status(400).send({error:error})
    }
}

const updateSchedule=(req,res)=>{
const company_id=req.id
const checkScheduleQuery="SELECT * FROM schedul_part WHERE id=? WHERE company_id=?"
const updateQuery="UPDATE schedul_part SET schedul_id=?, techer_id=?, subject_id=?,schedule_time_id=? WHERE id=? AND company_id=?"
const selectScheduleLetterGrade="SELECT sp.*,s.*,l.*, g.grade,st.*,sb.title FROM schedul_part AS sp JOIN schedule_time AS st ON sp.schedule_time_id=st.id JOIN schedul AS s ON  sp.schedul_id=s.id JOIN letter_grades AS l ON  s.letter_grade_id=l.id  JOIN grade  AS g ON l.grade_id=g.id JOIN subject as sb ON sb.id=sp.subject_id JOIN company AS com ON sp.company_id=com.id WHERE schedul_id=? AND schedule_time_id=?"
const selectTeacherSubject="SELECT tcg.*,t.firstname,t.middlename,sb.title FROM techer_course_grade AS tcg JOIN techer AS t ON t.id=tcg.techer_id JOIN subject AS sb ON tcg.subject_id=sb.id JOIN t.company_id=sb.company_id  WHERE techer_id=? AND subject_id=?"
const selectCheckTeacherSchedul="SELECT sp.schedul_id,g.grade,l.letter,t.firstname,t.middlename,s.day_title,st.start_time,st.end_time FROM schedul_part AS sp JOIN schedul AS s ON sp.schedul_id=s.id JOIN techer AS t ON sp.techer_id=t.id JOIN schedule_time AS st ON st.id=sp.schedule_time_id JOIN letter_grades AS l ON s.letter_grade_id=l.id JOIN grade AS g ON g.id=l.grade_id  WHERE techer_id=? AND schedul_id=?  AND schedule_time_id=?"
    try {
        const {id}=req.params
        const {schedul_id,teacher_id,subject_id,schedule_time_id}=req.body;
        dbPool.query(checkScheduleQuery,[id,company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(400).json({error:"Schedule no found"})
            }
            dbPool.query(selectTeacherSubject,[teacher_id,subject_id],(error,result)=>{
                if(error){
                    return res.status(404).json({error:error['sqlMessage']})
                }
                if(result.length==0){
              return res.status(404).json({error:"This teacher is not set for this course"})
                } 
                // chech teacher if free on that schedule date and time
                dbPool.query(selectCheckTeacherSchedul,[teacher_id,schedul_id,schedule_time_id],(error,result)=>{
                    if(error){
                        return res.status(400).json({error:error['sqlMessage']})
                    }
                   if(result.length>0){
                    const firstname=result[0]['firstname']
                    const middlename=result[0]['middlename']
                    console.log(result)
                    const day=result[0]['day_title']
                    const grade=result[0]['grade']
                    const gradeLetter=result[0]['letter']
                    const start_time=result[0]['start_time']
                    const end_time=result[0]['end_time']
                       return res.status(400).json({error:`${firstname } ${middlename} on ${day} has a class at Grade ${grade} ${gradeLetter} from ${start_time} to ${end_time}`})
                   }
                    dbPool.query(selectScheduleLetterGrade,[schedul_id,schedule_time_id],(error,result)=>{
                        if(error){
                            return res.status(404).json({error:error['sqlMessage']})
                        }
                        if(result.length>0){
                            const grade=result[0]['grade']
                            const gclass=result[0]['letter']
                            const day=result[0]['day_title']
                            const subject=result[0]['title']
                            const start_time=result[0]['start_time']
                            const end_time=result[0]['end_time']
                            return res.status(400).json({error:`Grade ${grade} ${gclass} on ${day} from ${start_time} to ${end_time} has  ${subject} class and is not free`})
                        }

                    // update schedule
                    dbPool.query(updateQuery,[schedul_id,teacher_id,subject_id,schedule_time_id,id,company_id],(error,result)=>{
                        if(error){
                            return res.status(400).json({error:error['sqmMessage']})
                        }
                        if(result['changedRows']==1){
                            return res.status(200).json({data:result})
                        }
                    })
    
                    })
                })
                // Checking the class room if not free
            })
        })
    } catch (error) {
        res.status(400).send({error:error})
    }
}
const deleteSchedulePart=(req,res)=>{
const {id}=req.params
const deleteQuery="DELETE FROM schedul_part WHERE id=?"
try{
    dbPool.query(deleteQuery,[id],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMessage']})
        }
        if(result['affectedRows']==1){
            return res.status(200).json({data:result,message:"Schedule deleted successfuly"})
        }
        return res.status(400).json({error:"Schedule not deleted "})
    })

}
catch(error){
    return res.status(400).json({error:error})
}
}



module.exports={getSchedulePart,getScheduleParts,registerSchedulePart,updateSchedule,deleteSchedulePart}