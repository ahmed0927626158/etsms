const dbPool=require("../../config/dbConfig")
const homeInfo=(req,res)=>{
    const id=req.id
    const company_id=req.company_id

    const numberOfMyCourse="SELECT distinct tcg.letter_grade_id FROM techer_course_grade AS tcg  WHERE tcg.techer_id=?"
    const numberOfStudents="SELECT count(s.id) AS numberOfStudents FROM student AS s WHERE s.letter_grade_id=? AND s.company_id=?"
    const numberOfAttendance="SELECT  letter_grade_id,subject_id,schedule_time_id,date,COUNT(*) AS attendanceCount FROM attendance WHERE techer_id=? GROUP BY letter_grade_id,subject_id,schedule_time_id,date"
    dbPool.query(numberOfMyCourse,[id],(error,result)=>{
        if(error){
            console.log(error['sqlMessage'])
        }
        
        var arrayStudents=[]
        var totaleStudents=[]
        var totaleSection=result.length
        var totaleattendance=0

        const attendancePromise= ()=>{
            return new Promise((resolve,reject)=>{
                dbPool.query(numberOfAttendance,[id], (error, queryResult) => {
                    if (error) {
                        console.log(error); 
                    }
                   const attendanceData=queryResult.reduce((sum,acc)=>sum+acc.attendanceCount,0)
                   totaleattendance=attendanceData
                    resolve(); // Resolve the promise when done
                });
            })
        }
        var attendance=attendancePromise()
        // get totale students
        const promises = result.map(section => {
            return new Promise((resolve, reject) => {
                dbPool.query(numberOfStudents, [section.letter_grade_id, company_id], (error, queryResult) => {
                    if (error) {
                        console.log(error);
                        return reject(error); // Reject the promise on error
                    }
                    arrayStudents.push(queryResult[0]['numberOfStudents']);
                    resolve(); // Resolve the promise when done
                });
            });
        });
        
        // Wait for all promises to complete
        Promise.all(promises)
            .then(() => {
                // All queries are done, you can now use totalstudents
                const totalSum = arrayStudents.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue;
                }, 0);
                totaleStudents=totalSum
                
                return res.status(200).json({totaleStudents:totaleStudents,totaleSection:totaleSection,totaleattendance:totaleattendance})
            })
            .catch(err => {
                // Handle any errors that occurred during the queries
                console.error('Error fetching student numbers:', err);
            });
    

    })
}
module.exports={homeInfo}