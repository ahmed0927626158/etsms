const dbPool=require("../config/dbConfig")

const getTecherGradeSubs=(req,res)=>{
    try{
       dbPool.query(' SELECT * FROM techer_course_grade',(error,result)=>{
        if(!data){
            return res.status(404).send({
                success:false,
                "message":"student not found"
            })
        }
        return res.status(200).send(data[0])
        });
        
    }
    catch(error){
        res.status(400).send({error:error})
    }
}

/*const getTecherGradeSub=(req,res)=>{
    const {id}=req.params
    const company_id=req.id
    const selectSubjects="SELECT s.id, s.title FROM subject AS s WHERE s.company_id=?"
    const selecTeacherSubjectGrade="SELECT tcg.id, t.firstname AS teachername,t.middlename,t.lastname,g.grade,l.letter AS section,s.title AS subject FROM techer_course_grade AS tcg JOIN techer AS t ON t.id=tcg.techer_id JOIN letter_grades AS l ON l.id=tcg.letter_grade_id JOIN grade AS g ON l.grade_id=g.id JOIN subject AS s ON s.id=tcg.subject_id WHERE t.company_id=? AND tcg.id=?"
    // select Subjects
    dbPool.query(selectSubjects,[company_id],(error,result)=>{
        if(error){
            console.log(error)
        }
        const subjects=result
        dbPool.query(selecTeacherSubjectGrade,[company_id,id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            //return res.status(200).json({data:result})
            //return res.status(200).json({ data: data })
            //res.render("subject/managesubject",{date:formattedDate,subjects:subjects,data:result})
            return res.status(200).json({ subjects: subjectsResult, teacherData: teacherResult });
        })
    })*/    
    /*try{
        const data= dbPool.query(' SELECT * FROM techer_course_grade WHERE id=?',[id]);
        if(!data){
            return res.status(404).send({
                success:false,
                "message":"student not found"
            })
        }
        return res.status(200).send(data[0])
    }
    catch(error){
        res.status(400).send({error:error})
    }*
}*/

const getTeacherGradeSub = (req, res) => {
    const { id } = req.params;
    const company_id = req.id;
    console.log(id)
    try{
    const selectSubjects = "SELECT s.id, s.title FROM subject AS s WHERE s.company_id=?";
    const selectTeacherSubjectGrade = `
        SELECT tcg.id, t.firstname AS teachername, t.middlename, t.lastname, g.grade, l.letter AS section, s.title AS subject 
        FROM techer_course_grade AS tcg 
        JOIN techer AS t ON t.id = tcg.techer_id 
        JOIN letter_grades AS l ON l.id = tcg.letter_grade_id 
        JOIN grade AS g ON l.grade_id = g.id 
        JOIN subject AS s ON s.id = tcg.subject_id 
        WHERE t.company_id=? AND tcg.id=?`;

    // Select Subjects
    dbPool.query(selectSubjects, [company_id], (error, subjectsResult) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Database error' });
        }
        if(subjectsResult.length==0){
            return res.status(400).json({ error: "subject not found" })
        }

        // Select Teacher Subject Grade
        dbPool.query(selectTeacherSubjectGrade, [company_id, id], (error, teacherResult) => {
            if (error) {
                return res.status(400).json({ error: error['sqlMessage'] });
            }
            if (teacherResult.length == 0) {
                
                return res.status(400).json({ error: "info not found" })
            }
            return res.status(200).json({ subjects: subjectsResult, teacherData: teacherResult });
        });
    });
}catch(error){
  
    res.status(400).send({error:error})
}
};




const getTecherGradeSubLink=(req,res)=>{
    const { schedul_id, subject_id } = req.query; // Extract schedule_id and subject_id from query parameters

    const selectTeacherGradeSubject = `
        SELECT t.id, t.firstname, t.middlename, t.phone 
        FROM techer AS t 
        JOIN techer_course_grade AS tcg ON t.id = tcg.techer_id 
        JOIN schedul AS s ON s.letter_grade_id = tcg.letter_grade_id 
        JOIN subject AS sb ON tcg.subject_id = sb.id 
        WHERE s.id = ? AND sb.id = ?`;

    try {
        dbPool.query(selectTeacherGradeSubject, [schedul_id, subject_id], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(400).json({ error: error['sqlMessage'] });
            }

            const teacher_data = result.map(teacher => ({
                label: `${teacher.firstname} ${teacher.middlename} ${teacher.phone}`,
                id: teacher.id
            }));

            return res.status(200).json({ teacher_data });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};





const registerTecherGradeSub=(req,res)=>{
const comp_id=req.id
const {teacher_id,subject_id,letter_grade_id}=req.body;
const insertQuery='INSERT INTO techer_course_grade(techer_id,subject_id,letter_grade_id)  VALUES(?,?,?)'
const checkSection="SELECT t.firstname,t.middlename,s.title,g.grade,l.letter FROM techer AS t JOIN techer_course_grade AS tcg ON t.id=tcg.techer_id JOIN subject AS s ON s.id=tcg.subject_id JOIN letter_grades AS l ON l.id=tcg.letter_grade_id JOIN grade AS g ON l.grade_id=g.id WHERE tcg.subject_id=? AND tcg.letter_grade_id=?"
const schooleTeacherSubject="SELECT t.id,s.id,com.id FROM subject AS s JOIN company AS com ON com.id=s.company_id JOIN techer AS t ON com.id=t.company_id JOIN letter_grades as l ON l.company_id=com.id WHERE t.id=? AND s.id=? AND l.id=? AND com.id=? "
const checkTS="SELECT techer_id,subject_id FROM techer_course_grade WHERE techer_id=? AND subject_id=? AND letter_grade_id=?"    
try{
    // check if this course and teacher exist at the same schoole
    dbPool.query(schooleTeacherSubject,[teacher_id,subject_id,letter_grade_id,comp_id],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMesssage']})
        }
        if(result.length==0){
            return res.status(400).json({error: "All informations are not register"})
        }
// check if the course is assiged to this teacher
        dbPool.query(checkTS,[teacher_id,subject_id,letter_grade_id,comp_id],(error,result)=>{
           if(error) 
            {
                return res.status(400).json({error:error['sqlMesssage']})
                }
            if(result.length>0){
            return res.status(400).json({error:"This course is assigned to this teacher before"})
            }
            // check if this grade section for this course is assigned to other teacher
            dbPool.query(checkSection,[subject_id,letter_grade_id],(error,result)=>{
                if(error){
                    console.log(error)
                    return res.status(400).json({error:error['sqlMessage']})
                }
                if(result.length>0){
                    const errorresponse=result.map(function(info){
                        return { 
                            message:`Teacher ${info.firstname} ${info.middlename} is assigned for grade ${info.grade} ${info.letter} for ${info.title} subject`
                            }
                        })
                        return res.status(400).json({error:errorresponse[0]['message']})
                    }
                // If the teacher is assinged for this course
                dbPool.query(insertQuery,[teacher_id,subject_id,letter_grade_id],(error,result)=>{
                    if(error){
                        return res.status(400).json({error:error['sqlMessage']})
                    }
                    return res.status(200).json({data:result})
                });
            })
        })
    })
    }
    catch(error){
        res.status(400).send({error:error})
    }
}
//////new

const deleteTeacherGradeSubs = (req, res) => {
    try {
        const { id } = req.params
        const deleteQuery = "DELETE FROM techer_course_grade WHERE id=?"
            dbPool.query(deleteQuery, [id], (error, result) => {
                if (error) {
                    return res.status(400).json({ error: error['sqlMessage'] })
                }
                if (result['affectedRows'] != 1) {
                    return res.status(400).json({ error: "Teacher subject link not removed" })
                }
                return res.status(200).json({ data: "Teacher subject link removed successfuly" })

            })

        

    } catch (error) {
        return res.status(500).json({ error: "internal server error" })
    }
}
module.exports={getTecherGradeSubs,getTeacherGradeSub,registerTecherGradeSub,getTecherGradeSubLink,deleteTeacherGradeSubs}
