
const sqlConnectionPool=require("../config/dbConfig")
const grade={
getGrade:(grade,comp_id)=>{
    return new Promise((resolve,reject)=>
        {
    const queryString="SELECT grade FROM grade WHERE grade=? AND company_id=?";
    if(grade>12){
        reject("Grade can not be greater than 12")
    }
   else if(grade<1){
        reject("Grade can not be less than 1")
    }
    setTimeout(()=>{
       sqlConnectionPool.query(queryString,[grade,comp_id],(error,result)=>{
        
        if(error){
          reject(error)
        }
       else if(result.length>0){
        reject("Grade is already register")
       }
       
        else{
            resolve("enabled for register")
        }
    })
    },2000)
    })   
},
total_letter_grade:(grade,total_lt_grade)=>{
    const quesryString="SELECT total_lt_grade FROM grade WHERE grade=?"
    return new Promise((resolve,reject)=>{
        sqlConnectionPool.query(quesryString,[grade],(error,result)=>{
            if(error){
                reject(error)
            }
            else if(result.length>0){
                const updateTotalGrade="UPDATE grade SET total_lt_grade=? WHERE grade=?"
                sqlConnectionPool.query(updateTotalGrade,[total_lt_grade,grade],(error,result)=>{
                    if(error){
                        reject(error)
                    }
                    // To get current new updated grade and total letter garde
                    const getGradeAndTotalLtGrade="SELECT grade,total_lt_grade FROM grade WHERE grade=?"
                    sqlConnectionPool.query(getGradeAndTotalLtGrade,[grade],(error,result)=>{
                        if(error){
                            reject(error)
                        }
                        console.log(result)
                        resolve(`Letter grades for grade ${result[0]['grade']} is updated to ${result[0]['total_lt_grade']}`)
                    })
                })
            }
        })
    })

}


}
module.exports=grade