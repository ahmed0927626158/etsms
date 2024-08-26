const dbPool=require("../config/dbConfig")
const moment=require("moment-timezone")
var today = new Date();
var day = today.toLocaleString('en-us', { weekday: 'long' });
const selectQuery='SELECT TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time,st.id AS schedule_time_id,sc.day_title,l.letter,l.id AS letter_id,g.grade,g.id AS grade_id,sb.title AS subject_name,sb.id AS subject_id,t.firstname,t.middlename,t.id AS teacher_id FROM schedule_time AS st JOIN schedul_part AS sp ON sp.schedule_time_id=st.id JOIN subject AS sb ON sb.id=sp.subject_id JOIN schedul AS sc ON sc.id=sp.schedul_id JOIN letter_grades AS l ON sc.letter_grade_id=l.id JOIN grade AS g ON g.id=l.grade_id JOIN techer AS t ON sp.techer_id=t.id WHERE sp.techer_id=? AND sc.day_title=?'
// const teacherSubjectGradeQuery="SELECT t.id,t.firstname,sb.id,sb.title,g.grade,g.id,l.letter,l.id FROM schedul_part AS sp JOIN techer AS t ON sp.techer_id=t.id JOIN subject AS sb ON sp.subject_id=sb.id JOIN schedul AS sc ON sc.id=sp.schedul_id JOIN letter "
moment.tz.setDefault("Africa/Addis_Ababa")
const getAttendanceType=(req,res,next)=>{
    const teacher_id=req.id
    dbPool.query(selectQuery,[teacher_id,day],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMessage']})
        }
        
        if(result.length==0){
            const url="/teacher-error?errorCode=403 "+'&errorMessage=You don not have Schedule at this time'
           return res.redirect(url)
            // return res.status(400).json({error:"Schedule not found"})
        }
        var currentTime=moment().tz('Africa/Addis_Ababa');
        currentTime=moment(currentTime).subtract(6, 'hours')
       
            const currentTimeRange=result.find(range=>{
            var startTimeArray = range.start_time.split(':');
            var startT = startTimeArray[0].replace(/^0+/, '') + ':' + startTimeArray[1];
            var endTimeArray = range.end_time.split(':');
            var endT = endTimeArray[0].replace(/^0+/, '') + ':' + endTimeArray[1];
            const start_time=moment(startT,'HH:mm')
            const end_time=moment(endT,'HH:mm')
            return currentTime.isBetween(start_time,end_time, null, '[]')
        })
        if(!currentTimeRange){
            const url="/teacher-error?errorCode=403"+ '&errorMessage=You don not have Schedule at this time'
           return res.redirect(url)
            // return res.status(400).json({error:"You can't take attendance at this time"})
        }
        if(currentTimeRange){
            req.grade_info=result[0]
            next()
        }
    })
}
module.exports=getAttendanceType