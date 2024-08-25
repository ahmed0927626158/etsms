const sqlConnectionPool=require("../config/dbConfig")

const letterGradeModel={
    updateLetterGrade:()=>{
    },
    getLetterGradeId:(grade,letter_grade,company_id)=>{
        // Check grade existence
const sqlGetGrade="SELECT id,grade,total_lt_grade FROM grade WHERE grade=? AND company_id=?"
     return new Promise((resolve,reject)=>{
    sqlConnectionPool.query(sqlGetGrade,[grade,company_id],(error,result)=>{
    let grade_id
    let totale_lt_grade
    let grade_result
        if(error){
            reject(error)
        }
        else if(result.length==0){
            reject("Grade not found")
        } 
        grade_id=result[0]['id']
        totale_lt_grade=result[0]['total_lt_grade']
        grade_result=result
        // select letter grade where grade id foun above query
     const sqlGetLetter="SELECT grade_id,count(*) AS grade_lt_counter FROM letter_grades WHERE grade_id=? AND company_id=?"
     const checlLetter="SELECT letter FROM letter_grades WHERE grade_id=? AND letter=? AND company_id=?"
    //  check if letter exist before
    sqlConnectionPool.query(checlLetter,[grade_id,letter_grade,company_id],(error,result)=>{
        
        if(error){
            reject(error['sqlMeessage'])
        }
        // If letter grade exist before
        if(result.length>0){
            reject(`Letter grade ${letter_grade} for grade ${grade} is already exist`)
        }
        // count total letter grade for this grade 
    sqlConnectionPool.query(sqlGetLetter,[grade_id,company_id],(error,result)=>{
            if(error){
                reject(error['sqlMeessage'])
            }
            let grade_lt_counter=result[0]['grade_lt_counter']
            // Check if total letter grade for grade found first query is greater than already exist letter grade 
           if(grade_lt_counter>=totale_lt_grade)
            {
                reject(`Totale letter grade for grade ${grade} is ${totale_lt_grade} can not add more`)
            }
            resolve(grade_result)
        })
    })
    
    })

     })
    }

}
module.exports=letterGradeModel