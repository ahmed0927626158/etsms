const dbPool=require("../config/dbConfig")
const moment=require("moment-timezone")
const {sendEmail}=require("../utils/sendMaile")
moment.tz.setDefault("Africa/Addis_Ababa")
const attendance= {
    fillAttendanceModel:(studentData,grade_info)=>{
        const currentDate = moment(); // Get the current date and time in the specified time zone
         const formattedDate = currentDate.format('YYYY-MM-DD'); 

        const students=studentData
        // data from attendance middleware
        const {teacher_id,subject_id,letter_id,schedule_time_id,subject_name,start_time,end_time}=grade_info

        const insertAttendanceQuery="INSERT INTO attendance(techer_id,student_id,letter_grade_id,subject_id,schedule_time_id,status,date) VALUES(?,?,?,?,?,?,?)"
        const selectStudentQuery="SELECT s.id,f.email FROM family_student fs JOIN student  AS s ON fs.student_id=s.id JOIN family AS f ON f.id=fs.family_id  WHERE s.id=?"
        const selectTeacher="SELECT id,company_id FROM techer WHERE id=?"
        const attendanceExist="SELECT student_id,techer_id,schedule_time_id,letter_grade_id FROM attendance WHERE techer_id=? AND subject_id=? AND schedule_time_id=? AND letter_grade_id=? AND date=?"
        var notFoundStudents=[]
        var insertedStudents=[]

return new Promise((resolve,reject)=>{
        dbPool.query(attendanceExist,[teacher_id,subject_id,schedule_time_id,letter_id,formattedDate],(error,result)=>{
            if(error){
                console.log(error['sqlMessage'])
            }
            if(result.length>0){
                console.log("Attendance already taken")
                reject("Attendance already taken")
                return
            }
                dbPool.query(selectTeacher,[teacher_id],async(error,result)=>{
                    if(error){
                        reject(error['sqlMessage'])
                    }
                    if(result.length==0)
                    {   
                    reject("You have no teacher role")
                    }
                    if(!students){
                        reject("No student data")
                    }
                       students.forEach(student => {
                        let stud_id=student['id']
                        let status=student['status']
                        let fname=student['fname']
                        let mname=student['mname']
                        dbPool.query(selectStudentQuery,[stud_id],(error,result)=>{
                            if(error){
                                console.log(error['sqlMessage'])
                            }
                            let email=result[0]['email']
                            if(result.length>0){
                                // console.log(student)
                                dbPool.query(insertAttendanceQuery,[teacher_id,stud_id,letter_id,subject_id,schedule_time_id,status,formattedDate], async(error,result)=>{
                                    if(error){
                                        console.log(error['sqlMessage'])
                                        reject(error['sqlMessage'])
                                    }
                                   await sendEmail(email,"Attendance Message",`${fname} ${mname} is ${status} today for course ${subject_name} from ${start_time} to ${end_time} time`)
                                })
                            }
                        })
                    });
                resolve("registered")
               
            })

        })


})

    }
}

module.exports=attendance