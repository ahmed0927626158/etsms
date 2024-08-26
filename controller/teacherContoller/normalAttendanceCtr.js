const dbPool=require("../../config/dbConfig")
const moment=require("moment")
const normaAttendanceModel=require("../../models/normalattendance.model")
const getStudents=(req,res)=>{
    const {grade,letter}=req.grade_info
    
    var  startTimeArray = req.grade_info['start_time'].split(':')
    var startT = startTimeArray[0].replace(/^0+/, '') + ':' + startTimeArray[1];
    req.grade_info['start_time']=startT
    var endTimeArray = req.grade_info['end_time'].split(':');
    var endT = endTimeArray[0].replace(/^0+/, '') + ':' + endTimeArray[1];
    req.grade_info['end_time']=endT
    
    const selectQuery="SELECT st.id,st.firstname,st.middlename,st.lastname FROM student AS st JOIN letter_grades AS l ON l.id=st.letter_grade_id JOIN grade AS g ON g.id=l.grade_id WHERE g.grade=? AND l.letter=?"
    try{
         dbPool.query(selectQuery,[grade,letter],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
        if(result.length==0){
            return res.status(400).json({error:"user not found"})
        }
        return res.status(200).json({data:result,grade_info:req.grade_info})
        });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}



const getStudent=(req,res)=>{
    const {id}=req.params
    try{
        dbPool.query(' SELECT * FROM student WHERE id=?',[id],(error,result)=>{
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


const fillAttendance= (req,res)=>{
const studentData=req.body

const grade_info=req.grade_info
    normaAttendanceModel.fillAttendanceModel(studentData,grade_info)
      .then((response)=>{
        const selectAttendance="SELECT * FROM attendance"   
            dbPool.query(selectAttendance,(error,result)=>{
                if(error){
                    reject(error['sqlMessage'])
                }
                return res.status(200).json({response:"Attendance taken"})
                 })
                
                })
      .catch((error)=>{
        return res.status(400).json({error:error})
    })
    
    }
// Update student 
const updateStudentAttendance=(req,res)=>{
    const {student_id,attendance}=req.body
       const currentDate = moment(); // Get the current date and time in the specified time zone
        const formattedDate = currentDate.format('YYYY-MM-DD'); 
       const selectQuery=`SELECT DISTINCT s.id, a.date,a.id as attendance_id,st.id as schedule_time_id, TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time, DATE_FORMAT(STR_TO_DATE(a.date, '%Y-%m-%dT%H:%i:%s.%fZ'), '%y %m %d') as date FROM student as s JOIN attendance as a ON a.student_id=s.id JOIN schedule_time as st ON a.schedule_time_id=st.id WHERE s.id=? AND a.date=?`
        const updateQuery="UPDATE attendance SET status=? WHERE student_id=? AND id=? AND schedule_time_id=?"
    try {
        
        
        // Check student if registered
        dbPool.query(selectQuery,[student_id,formattedDate],async(error,result)=>{
            if(error){
                console.log(error)
                return res.status(400).json({error:error['sqlMessage']})
            }
           
            if(result.length==0){
                return res.status(400).json({error:"you can not update attendance now"})
            }
            // console.log(req.body)
            var counter=0
            let updated=false
         const updatePromis=  result.map( async (attendanceData )=> { 
                counter=counter+1
                var schedule_time_id=attendanceData.schedule_time_id
                var attendance_id=attendanceData.attendance_id
                    const startTime = moment(attendanceData.start_time, "HH:mm");
                    const endTime = moment(attendanceData.end_time, "HH:mm");
                    // Add 10 minutes
                    const endTimeAdd10 = endTime.add(10, 'minutes');
                    // console.log(startTime.format('HH:mm'),endTimeAdd10.format('HH:mm'))
                    var currentTime = moment().tz('Africa/Addis_Ababa');
                    // Check if the current time is between startTime and endTime
                    currentTime=(moment(currentTime).subtract(6, 'hours'))
                    const isBetween = currentTime.isBetween(moment(startTime,'HH:mm'), moment(endTimeAdd10,'HH:mm'), null, '[]'); // '[]' includes the 
                    
                    // console.log(attendance)
                    if(isBetween){
                        return new Promise((resolve,reject)=>{
                            dbPool.query(updateQuery,[attendance,student_id,attendance_id,schedule_time_id],(error,updateResult)=>{
                                if(error){
                                    console.log(error)
                                }
                                updated=true
                                resolve(updateResult)
                                //  return res.status(204).json({message:"attendance updated"})
                            }) 
                        })
                      
                    }    
            });

            await Promise.all(updatePromis)
            if (updated){
                return res.status(204).json({message:"attendance updated"})
            }
            else if(counter==result.length)
                 return res.status(400).json({error:"you can not update attendance now"})
        })
        
    } catch (error) {
        res.status(400).send({error:error})  
    }
}
const deleteStudent=(req,res)=>{
    const selectQuery="SELECT firstname,middlename,id FROM student WHERE id=?"
    const deleteQuery="DELETE FROM student WHERE id=?"
    let firstname,lastname
    try{
const {id}=req.params
// Check is student exist
dbPool.query(selectQuery,[id],(error,result)=>{
    if(error){
        return res.status(400).json({error:error['sqlMessage']})
    }
    if(result.length==0){
        return res.status(400).json({error:"Student not registered"})
    }
    firstname=result[0]['firstname']
    middlename=result[0]['middlename']
    // delete student if exist
    dbPool.query(deleteQuery,[id],(error,result)=>{
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
module.exports={getStudents,getStudent,fillAttendance,updateStudentAttendance,deleteStudent}