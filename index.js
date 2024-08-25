const  express =require ("express")
const { query, validationResult } = require('express-validator');
const session = require('express-session');
const  dotenv =require("dotenv").config()
const ejs=require("ejs")
const path=require("path")
const  bodyParser =require("body-parser");
const moment=require("moment-timezone")
const cookieParser=require("cookie-parser")

const dbPool=require("./config/dbConfig.js")

const studentRoute=require("./routes/studentRoute.js")
const gradeRoute=require("./routes/gradeRoute.js")
const letterGradeRoute=require("./routes/letterGradeRoute.js")
const subjectRoute=require("./routes/subjectRoute.js")
const companyTeacherRoute=require("./routes/teacherRoute.js")
const familyRoute=require("./routes/familyRoute.js")
const techerGradeSubjRoute=require("./routes/techerGradeSubjectRoute.js")
const familyStudentRoute=require("./routes/familyStudentRoute.js")
const scheduleRoute=require("./routes/scheduleRoute.js")
const gradeSubjectRoute=require("./routes/gradeSubjectRoute.js")
const scheduleTimeRoute=require("./routes/shcedulTimeRoute.js")
const shcedulPartRoute=require("./routes/schedulePartRoute.js")
const attendanceRoute=require("./routes/teacherRoute/attendanceRoute.js")
const companyRoute=require("./routes/companyRoute.js")
const companyLoginRoute=require("./routes/companyAuthRoute.js")
const markRoute=require("./routes/markRoute.js")

// teacher
const teacherLoginRoute=require("./routes/teacherRoute/authRoute/authRoute.js")
const teacherRoute=require("./routes/teacherRoute/teacherRoute.js")
const teacherSectionRoute=require("./routes/teacherRoute/sectionRoute.js")
const teacherMarkRoute=require("./routes/teacherRoute/markRoute.js")


// custom middleware
const attendanceMiddleware=require("./middleware/attendanceMiddleware.js")
const companyAuthMiddleware=require("./middleware/compAuthMiddleware.js")
const teacherAuthMiddleware=require("./middleware/teacherAuthMiddleware.js")



const date=new Date()
const options = { weekday: 'short', day: 'numeric', year: 'numeric', month: 'short' };
const formattedDate = date.toLocaleDateString('en-US', options);
// const date=new Date().toLocaleString('en-US',{hour:'numeric',minute:'numeric',hour12:true});

// var currentTime=moment().tz('Africa/Addis_Ababa');
// // console.log(moment(currentTime))
// currentTime=moment(currentTime).subtract(6, 'hours')
// const date=new Date().toLocaleString('en-US',{hour:'numeric',minute:'numeric',hour12:true});
// console.log(date)

// const days=['Sunday','Monday','Tuesday','Wednesday','Thuresday','Friday','Saturday']
// var currentTime=moment().tz('Africa/Addis_Ababa');
// console.log(currentTime)
//         currentTime=moment(currentTime).subtract(6, 'hours')
        

const app =express()

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname , '/public')));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));


// view engin
app.set('view engine', 'ejs')

const PORT=process.env.PORT||5000

// Route
app.use("/api/company",companyRoute)

app.use("/api/student",companyAuthMiddleware,studentRoute)
app.use("/api/grade",companyAuthMiddleware,gradeRoute)
app.use("/api/letter-grade",companyAuthMiddleware,letterGradeRoute)
app.use("/api/subject",companyAuthMiddleware,subjectRoute)
app.use("/api/grade-subject",companyAuthMiddleware,gradeSubjectRoute)
app.use("/api/techer",companyAuthMiddleware,companyTeacherRoute)
app.use("/api/family",companyAuthMiddleware,familyRoute)
app.use("/api/techer-grade-subject",companyAuthMiddleware,techerGradeSubjRoute)
app.use("/api/family-student",familyStudentRoute)
app.use("/api/schedule",companyAuthMiddleware,scheduleRoute)
app.use("/api/schedule-time",companyAuthMiddleware,scheduleTimeRoute)
app.use("/api/schedule-part",companyAuthMiddleware,shcedulPartRoute)
app.use("/api/mark",companyAuthMiddleware,markRoute)
app.use("/api/company-auth",companyLoginRoute)
// teacher route
app.use("/api/teacher/auth",teacherLoginRoute)
app.use("/api/teacher/",teacherAuthMiddleware,teacherRoute)
// app.use("/api/teacher/grade",teacherAuthMiddleware,teacherGradeRoute)

app.use("/api/get-student-normal-attendance",teacherAuthMiddleware,attendanceMiddleware,attendanceRoute)
app.use("/api/update-attendance",teacherAuthMiddleware,attendanceRoute)
app.use("/api/teacher-section",teacherAuthMiddleware,teacherSectionRoute)
app.use("/api/teacher-mark",teacherAuthMiddleware,teacherMarkRoute)
// get view
app.get("/",(req,res)=>{
    res.render("login")
})

// Function to generate random hex color codes
const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random() * (1 - 0.1) + 0.1).toFixed(2); // Alpha between 0.1 and 1
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};
app.get("/home",companyAuthMiddleware,(req,res)=>{
    const company_id=req.id
    const selectMark="SELECT name,percent FROM mark_type WHERE company_id=?"
    dbPool.query(selectMark,[company_id],(error,result)=>{
        if(error){
            console.log(error['sqlMessage'])
        }
        
        const showMark=result.length>0
        const markLabel = result.map(mark => mark.name+" "+mark.percent+"%");
         const percents = result.map(item => item.percent);
        const colors={
            backgroundColor:Array.from({ length: result.length }, generateRandomColor)
         } 
        
        res.render("home",{date:formattedDate,colors,markLabel,percents,showMark})
    })
    // res.render("home",{date:formattedDate})
})

app.get("/class",companyAuthMiddleware,(req,res)=>{
    const comp_id=req.id
    dbPool.query('SELECT g.grade,g.total_lt_grade,l.letter FROM grade AS g LEFT JOIN letter_grades AS l ON l.grade_id=g.id WHERE g.company_id=?',[comp_id],(error,result)=>{
        if(error){
            return res.status(404).send({
                success:false,
                "message":error
            })
        }
        const groupedData = result.reduce((acc, curr) => {
            const { grade, total_lt_grade, letter } = curr;
            if (!acc[grade]) {
              acc[grade] = { letters: '', total_lt_grade };
            }
            acc[grade].letters += '|'+letter;
            return acc;
          }, {});
          const dataArray = Object.entries(groupedData).map(([key, value]) => {
            return { grade: key, ...value };
        });
        const classSectionData=Object.values(dataArray)
        res.render("class/manageclass",{date:formattedDate,data:classSectionData})
    });
})

app.get("/teacher",companyAuthMiddleware,(req,res)=>{
    res.render("adminteacher/addteacher",{date:formattedDate})
})

app.get("/view-teachers",companyAuthMiddleware,(req,res)=>{
    const company_id=req.id
    const selectTeachers="SELECT t.id,t.firstname, t.middlename,t.lastname,t.gender,t.phone,t.email,t.level,t.study FROM techer AS t  WHERE t.company_id=?"
    dbPool.query(selectTeachers,[company_id],(error,result)=>{
        if(error){
            return res.status(404).json({error:error['sqlMessage']})
        }
        res.render("adminteacher/viewteacher",{data:result,date:formattedDate})
    })
})

app.get("/student",(req,res)=>{
    res.render("student/addstudent",{date:date})
})
// view student information
app.get("/view-student",companyAuthMiddleware,(req,res)=>{
    const company_id=req.id
    const selectStudents="SELECT s.id,s.firstname, s.middlename,s.lastname,s.gender,DATE_FORMAT(s.birthdate, '%Y-%m-%d') AS birthdate,s.address,g.grade,l.letter FROM student AS s JOIN letter_grades AS l ON l.id=s.letter_grade_id JOIN grade AS g ON l.grade_id=g.id WHERE s.company_id=? AND g.company_id=? AND l.company_id=?"
    dbPool.query(selectStudents,[company_id,company_id,company_id],(error,result)=>{
        if(error){
            return res.status(404).json({error:error['sqlMessage']})
        }
        res.render("student/viewstudent",{data:result,date:formattedDate})
    })
})
// get single student data
app.get("/student-profile",companyAuthMiddleware,(req,res)=>{

    res.render("student/studentprofile",{date:date})
})
// register family page
app.get("/add-family",companyAuthMiddleware,(req,res)=>{
    res.render("family/addfamily",{date:formattedDate})
})

// view Family information
app.get("/view-family",companyAuthMiddleware,(req,res)=>{
    const company_id=req.id
    const selectFamilys="SELECT f.id,f.firstname, f.middlename,f.lastname,f.gender,DATE_FORMAT(f.birthdate, '%Y-%m-%d') AS birthdate,f.address,f.phone,f.email FROM family AS f JOIN company AS com ON com.id=f.company_id WHERE f.company_id=? AND com.id=?"
    dbPool.query(selectFamilys,[company_id,company_id],(error,result)=>{
        if(error){
            return res.status(404).json({error:error['sqlMessage']})
        }
        
        res.render("family/viewfamily",{data:result,date:formattedDate})
        // return res.status(200).json({data:result})
    })
})
// family student link
app.get("/view-family-student",companyAuthMiddleware,(req,res)=>{
    const allFamilyStudentQuery="SELECT fs.id,f.firstname AS father_firstname,f.middlename AS father_middlename,f.lastname AS father_lastname,f.phone AS father_phone,f.email AS father_email,s.firstname AS student_firstname,s.middlename AS student_middlename,s.lastname AS student_lastname, l.letter ,g.grade FROM family_student AS fs JOIN family AS f ON fs.family_id=f.id JOIN student AS s ON fs.student_id=s.id JOIN letter_grades AS l ON s.letter_grade_id=l.id JOIN grade AS g ON l.grade_id=g.id"
    try{
        dbPool.query(allFamilyStudentQuery,(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(400).json({error:"No family registered"})
            }
            // return res.status(200).json({data:result})
            res.render("family/viewfamilystudent",{date:formattedDate,data:result})
        });   
    }
    catch(error){
        res.status(400).send({error:error})
    }
})

// family student link
app.get("/family-student-link",companyAuthMiddleware,(req,res)=>{
    res.render("family/familystudent",{date:date})
})
// family student link
app.get("/subject-teacher-link",companyAuthMiddleware,(req,res)=>{

    res.render("subject/subjectTeacher",{date:formattedDate})
})
// family student link
app.get("/subject",companyAuthMiddleware,(req,res)=>{
    const company_id=req.id
    const selectSubjects="SELECT s.id, s.title FROM subject AS s WHERE s.company_id=?"
    const selecTeacherSubjectGrade="SELECT tcg.id, t.firstname,t.middlename,t.lastname,g.grade,l.letter AS section,s.title AS subject FROM techer_course_grade AS tcg JOIN techer AS t ON t.id=tcg.techer_id JOIN letter_grades AS l ON l.id=tcg.letter_grade_id JOIN grade AS g ON l.grade_id=g.id JOIN subject AS s ON s.id=tcg.subject_id WHERE t.company_id=?"
    // select Subjects
    dbPool.query(selectSubjects,[company_id],(error,result)=>{
        if(error){
            console.log(error)
        }
        const subjects=result
        dbPool.query(selecTeacherSubjectGrade,[company_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            res.render("subject/managesubject",{date:formattedDate,subjects:subjects,data:result})
        })
    })    
})

app.get("/manage-schedule-date-time",companyAuthMiddleware,(req,res)=>{
    const company_id=req.id
    const selectGradeDay="SELECT s.id,g.grade,l.letter,s.day_title FROM letter_grades AS l JOIN grade AS g ON g.id=l.grade_id JOIN schedul AS s ON s.letter_grade_id=l.id WHERE l.company_id=? AND s.company_id=?"
     const selectScheduleTime='SELECT s.id,TIME_FORMAT(s.start_time, "%H:%i") as start_time,TIME_FORMAT(s.end_time, "%H:%i") as end_time FROM schedule_time AS s WHERE s.company_id=?'
    const assignSchedulData='SELECT sp.id,t.firstname,t.middlename,t.phone,sb.title,TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time,g.grade,l.letter,s.day_title FROM schedul_part AS sp JOIN techer AS t ON sp.techer_id=t.id JOIN subject AS sb ON sb.id=sp.subject_id JOIN schedule_time AS st ON st.id=sp.schedule_time_id JOIN schedul AS s ON sp.schedul_id=s.id JOIN letter_grades AS l ON l.id=s.letter_grade_id JOIN grade AS g ON g.id=l.grade_id WHERE sp.company_id=? '
     dbPool.query(selectGradeDay,[company_id,company_id],(error,result)=>{
    if(error){
// handle error
    }
    const scheduleGradeDay=result.map(function(schedul){
        return {
            grade_section:schedul.grade +" "+schedul.letter,
            day:schedul.day_title,
            id:schedul.id
             }
           })
    // get shedule data
    dbPool.query(assignSchedulData,[company_id],(error,result)=>{
        if(error){
        //    handle
        }
        const assigned_schedule_data=result.map(function(schedul){
            return {
                teacher:schedul.firstname+" "+schedul.middlename+" "+schedul.phone,
                subject:schedul.title,
                schedule_time:schedul.start_time+"--"+schedul.end_time,
                grade:schedul.grade+" "+schedul.letter,
                day:schedul.day_title,
                id:schedul.id
            }
        })

    // select schule time
    dbPool.query(selectScheduleTime,[company_id],(error,result)=>{
        if(error){
        }
        res.render("schedule/manageSchedulTimeDate",{date:formattedDate,scheduleGradeDay:scheduleGradeDay,scheduleTime:result,assigned_schedule_data:assigned_schedule_data})
    })
   })
})
})
// assign-schedule
app.get("/assign-schedule",companyAuthMiddleware,(req,res)=>{

    res.render("schedule/assign_schedule",{date:formattedDate})
})

// manage school mark
// assign-schedule
app.get("/mark",companyAuthMiddleware,(req,res)=>{
    const company_id=req.id
    const selectMark="SELECT id, name,percent FROM mark_type WHERE company_id=?"
    const markSum="SELECT sum(percent) as totale FROM mark_type WHERE company_id=?"
   
    dbPool.query(selectMark,[company_id],(error,result)=>{
        if(error){
            console.log(error)
        }
        let marks=result
        dbPool.query(markSum,[company_id],(error,result)=>{
            if(error){
                console.log(error)
            }
           

        res.render("mark/managemark",{date:formattedDate,marks:marks,totale:result[0]})
        })
    })

    
})

// Teacher Side login
app.get("/teacher-login",(req,res)=>{
    
    res.render("teacherView/login")
})


// Teacher home page
app.get("/teacher-home",teacherAuthMiddleware,(req,res)=>{
    const id=req.id
    const company_id=req.company_id
  
    const selectMySchedule='SELECT s.day_title,l.letter,g.grade,TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time,sb.title FROM schedul_part AS sp JOIN schedul AS s ON s.id=sp.schedul_id JOIN letter_grades AS l ON l.id=s.letter_grade_id JOIN grade as g ON g.id=l.grade_id JOIN subject as sb ON sp.subject_id=sb.id JOIN schedule_time AS st ON sp.schedule_time_id=st.id WHERE sp.techer_id=?'
    const selectMark="SELECT name,percent FROM mark_type WHERE company_id=?"
    dbPool.query(selectMySchedule,id,(error,result)=>{
        if(error){
            console.log(error['sqlMessage'])
        }
        let attendance=result
        dbPool.query(selectMark,[company_id],(error,result)=>{
            if(error){
                console.log(error['sqlMessage'])
            }
            
            const showMark=result.length>0
            const markLabel = result.map(mark => mark.name+" "+mark.percent+"%");
             const percents = result.map(item => item.percent);
            const colors={
                backgroundColor:Array.from({ length: result.length }, generateRandomColor)
             } 
            
            res.render("teacherView/home",{ user: req.session.teacher ,mySchedule:attendance, colors,markLabel,percents,showMark})
        })
    })
})



// attendance route
app.get("/take-attendance",teacherAuthMiddleware,attendanceMiddleware,(req,res)=>{
    const {letter_id,letter,grade,subject_name,day_title}=req.grade_info
    
    const company_id=req.company_id
    
    const select_students="SELECT s.firstname,s.middlename,s.lastname,s.id FROM student AS s WHERE s.company_id=? AND s.letter_grade_id=?"
    dbPool.query(select_students,[company_id,letter_id],(error,result)=>{
        if(error){
            console.log(error['sqlMessage'])
        }
        
        res.render("teacherView/pages/attendance",{ user: req.session.teacher,student_data:result,date:formattedDate,grade:grade,section:letter,subject:subjectRoute})
    })
})

// attendance 
app.get("/view-attendance",teacherAuthMiddleware,(req,res)=>{
    
    const teacher_id=req.id
    const company_id=req.company_id
    const selectTeacherQuery='SELECT sp.id,s.day_title,l.letter,g.grade,sb.title,TIME_FORMAT(st.start_time, "%H:%i") as start_time,TIME_FORMAT(st.end_time, "%H:%i") as end_time FROM schedul_part AS sp JOIN schedul AS s ON s.id=sp.schedul_id JOIN subject AS sb ON sb.id=sp.subject_id JOIN schedule_time as st ON st.id=sp.schedule_time_id JOIN letter_grades as l ON l.id=s.letter_grade_id JOIN  grade AS g ON g.id=l.grade_id WHERE sp.techer_id=? AND sp.company_id=? '
    try {
        dbPool.query(selectTeacherQuery,[teacher_id,company_id],(error,result)=>{
            if(error){
                // console.log(error)
            }
            const data=result.map(function(schedule){
                return {
                    label:schedule.grade+" "+schedule.letter+" " +schedule.day_title+" "+schedule.title+" "+ schedule.start_time+"--"+schedule.end_time,
                    id:schedule.id
                }
            })
         res.render("teacherView/pages/viewattendance",{ user: req.session.teacher,options:data})
        })
    }
        catch(error){
        }
})

app.get("/teacher-password-update",(req,res)=>{
   const email=req.query
   
   const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};
   if(isEmpty(email)||email.email==''){
   return res.redirect("/teacher-login")
   }
    res.render("teacherView/updatepassword")
})

app.get("/fill-exame",teacherAuthMiddleware,(req,res)=>{
   const id=req.id
   const company_id=req.company_id
   const selectGrade="SELECT g.id,g.grade FROM grade as g JOIN letter_grades as l ON l.grade_id=g.id JOIN techer_course_grade AS tcg ON l.id=tcg.letter_grade_id JOIN techer as t ON t.id=tcg.techer_id WHERE t.id=? AND t.company_id=?"
   dbPool.query(selectGrade,[id,company_id],(error,result)=>{
    if(error){
        console.log(error)
    }
    
    res.render("teacherView/pages/fillexame",{ user: req.session.teacher,grade:result })
   })
 })


app.get("/teacher-error",teacherAuthMiddleware,(req,res)=>{
    const errorCode=req.query.errorCode
    const errorMessage=req.query.errorMessage
    res.render("teacherView/pages/error",{errorCode:errorCode,errorMessage:errorMessage})
})


app.listen(PORT,(req,res)=>{
    console.log(`The  app is runing on port ${PORT}`)
})

