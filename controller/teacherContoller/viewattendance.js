const dbPool=require("../../config/dbConfig")
const moment=require("moment-timezone")
const viewAttendanceCtr=(req,res)=>{
const {id,weak,month}=req.query

const teacher_id=req.id
const company_id=req.company_id
// const selectSchedule='SELECT sp.id,s.day_title,l.letter,g.grade,sb.title,TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time FROM schedul_part AS sp JOIN schedul AS s ON s.id=sp.schedul_id JOIN subject AS sb ON sb.id=sp.subject_id JOIN schedule_time as st ON st.id=sp.schedule_time_id JOIN letter_grades as l ON l.id=s.letter_grade_id JOIN  grade AS g ON g.id=l.grade_id WHERE sp.id=? AND sp.techer_id=? AND sp.company_id=? '
const selectAttendanceAll="SELECT a.id, s.firstname,s.middlename,s.lastname,a.status, DATE_FORMAT(STR_TO_DATE(a.date, '%Y-%m-%dT%H:%i:%s.%fZ'), '%y %m %d')as date FROM attendance AS a JOIN student as s ON s.id=a.student_id JOIN techer as t ON t.id=a.techer_id WHERE a.techer_id=? AND t.company_id=? ORDER BY a.date ASC" 
const selectAttendanceAllMonthWeak="SELECT  DISTINCT a.id, s.firstname,s.middlename,s.lastname,a.status, DATE_FORMAT(STR_TO_DATE(a.date, '%Y-%m-%dT%H:%i:%s.%fZ'), '%y %m %d')as date FROM attendance AS a JOIN student as s ON s.id=a.student_id JOIN techer as t ON t.id=a.techer_id  JOIN schedul_part AS sp ON sp.techer_id=a.techer_id and sp.subject_id=a.subject_id  WHERE a.techer_id=? AND t.company_id=? AND a.date BETWEEN ? AND ? ORDER BY a.date DESC" 

const selectAttendanceId="SELECT  DISTINCT a.id, s.firstname,s.middlename,s.lastname,a.status, DATE_FORMAT(STR_TO_DATE(a.date, '%Y-%m-%dT%H:%i:%s.%fZ'), '%y %m %d')as date FROM attendance AS a JOIN student as s ON s.id=a.student_id JOIN techer as t ON t.id=a.techer_id  JOIN schedul_part AS sp ON sp.techer_id=a.techer_id and sp.subject_id=a.subject_id  WHERE  a.schedule_time_id=sp.schedule_time_id AND sp.id=?  AND a.techer_id=? AND t.company_id=? AND a.date BETWEEN ? AND ? ORDER BY a.date DESC" 


const timezone = 'Africa/Addis_Ababa';
const now = moment.tz(timezone);

// Calculate the start and end dates for the previous week
const startOfWeek = now.clone().startOf('isoWeek').format('YYYY-MM-DD');
const endOfWeek = now.clone().endOf('isoWeek').format('YYYY-MM-DD');

 // Calculate the start and end dates for the previous week
 const startOfPreviousWeek = now.clone().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
 const endOfPreviousWeek = now.clone().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');

try {
    if(id=="al"){
        dbPool.query(selectAttendanceAll,[teacher_id,company_id],(error,result)=>{
            if(error){
                console.log(error)
            }
           
            return res.status(200).json({data:result})
        })
     }

  else if(weak=='current_weak' && month=='current_month' && id=='all'){
        dbPool.query(selectAttendanceAllMonthWeak,[teacher_id,company_id,startOfWeek,endOfWeek],(error,result)=>{
            if(error){
                console.log(error)
            }
           
            return res.status(200).json({data:result})
        })
    }
    
  else if(weak=='current_weak' && month=='current_month' && id!='all'){
    dbPool.query(selectAttendanceId,[id,teacher_id,company_id,startOfWeek,endOfWeek],(error,result)=>{
        if(error){
            console.log(error)
        }
        return res.status(200).json({data:result})
    })
  }
  else if(weak=='previous_weak' && month=='current_month' && id=='all'){
    dbPool.query(selectAttendanceAllMonthWeak,[teacher_id,company_id,startOfPreviousWeek,endOfPreviousWeek],(error,result)=>{
        if(error){
            console.log(error)
        }
        return res.status(200).json({data:result})
    })
  }

  else if(weak=='previous_weak' && month=='current_month' && id!='all'){
    dbPool.query(selectAttendanceId,[id,teacher_id,company_id,startOfPreviousWeek,endOfPreviousWeek],(error,result)=>{
        if(error){
            console.log(error)
        }
        return res.status(200).json({data:result})
    })
  }
    
} catch (error) {
    return res.status(500).json({error:"Internal server error"})
}
}

const getSingleAttendance=(req,res)=>{
const {id}=req.params
const teacher_id=req.id

const selectStudId="SELECT student_id FROM attendance WHERE id=?"
const selectAttendanceAll=`SELECT s.id, s.firstname,s.middlename,s.lastname,  TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time,sc.day_title,a.status, DATE_FORMAT(STR_TO_DATE(a.date, '%Y-%m-%dT%H:%i:%s.%fZ'), '%y %m %d') as date FROM attendance AS a JOIN student as s ON s.id=a.student_id JOIN techer as t ON t.id=a.techer_id  JOIN schedule_time as st ON a.schedule_time_id=st.id  JOIN  schedul_part as sp ON sp.schedule_time_id=a.schedule_time_id JOIN schedul as sc on sc.id=sp.schedul_id WHERE t.id=? AND a.student_id=? AND (a.status = 'absent' OR a.date = CURDATE()) ORDER BY a.date DESC `

dbPool.query(selectStudId,[id],(error,result)=>{
    if(error){
        console.log(error)
    }
    const studId=result[0]['student_id'] 
    dbPool.query(selectAttendanceAll,[teacher_id,studId],(error,result)=>{
        console.log(error)
     if(error){
         return res.status(400).json({error:error['sqlMessage']})
        }
        const absentCount = result.filter(record => record.status === 'absent').length;
        console.log(absentCount)
         return res.status(200).json({attendanceData:result,totale_absent:absentCount})
    })

})
}

module.exports={viewAttendanceCtr,getSingleAttendance}