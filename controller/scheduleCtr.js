const dbPool=require("../config/dbConfig")

const getSchedules=(req,res)=>{
    const selectQuery='SELECT s.*,l.*,g.grade FROM schedul AS s '+'JOIN letter_grades AS l ON s.letter_grade_id=l.id '+'JOIN grade AS g ON l.grade_id=g.id'
    try{
        dbPool.query(selectQuery,(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            return res.status(200).json({data:result})
            });
        }
    catch(error){
                res.status(400).send({error:error})
            }
}

const getSchedule=(req,res)=>{
    
const {id}=req.params
console.log('errrppp',id)
const selectQuery='SELECT s.*,s.id AS schedule_id,l.*,g.grade FROM schedul AS s '+'JOIN letter_grades AS l ON s.letter_grade_id=l.id '+'JOIN grade AS g ON l.grade_id=g.id '+'WHERE s.id=?'
const selectSchedule="SELECT id FROM schedul WHERE id=?"
    try{
        dbPool.query(selectSchedule,[id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length==0){
                return res.status(400).json({error:"Schedule not found"})
            }
            dbPool.query(selectQuery,[id],(error,result)=>{
                if(error){
                    return res.status(400).json({error:error['sqlMessage']})
                }
                return res.status(200).json({ data: result[0] });
               });
        })
            }
    catch(error){
        res.status(400).send({error:error})
    }
}

const getAssignSchedule=(req,res)=>{
   const company_id=req.id

    const selectQuery='SELECT s.id,s.day_title,l.letter,l.id AS letter_id,g.grade FROM schedul AS s JOIN letter_grades AS l ON l.id=s.letter_grade_id JOIN grade AS g ON g.id=l.grade_id  WHERE s.company_id=? AND l.company_id=? AND g.company_id=?'
        try{
           
                dbPool.query(selectQuery,[company_id,company_id,company_id],(error,result)=>{
                    if(error){
                        return res.status(400).json({error:error['sqlMessage']})
                    }
                    // make suitable to return schedule data
                    const schedule_data=result.map(function(schedule){
                        return {
                            label:schedule.grade +" "+schedule.letter+" "+schedule.day_title,
                            id:schedule.id,
                            section_id:schedule.letter_id
                        }
                    })
                    return res.status(200).json({schedule_data:schedule_data})
                   });
        
                }
        catch(error){
            res.status(400).send({error:error})
        }
    }

const registerSchedule=(req,res)=>{
    console.log(req.body)
    const {letter_grade_id,title}=req.body;
    const array_Letter_id=letter_grade_id.split(',')
    const array_day_title=title.split(",")
    
    const comp_id=req.id
    const insertQuery="INSERT INTO schedul(letter_grade_id,day_title,company_id)  VALUES(?,?,?)"
    const checkDataExist="SELECT letter FROM letter_grades WHERE company_id=? AND id=?"
    const selectQuery="SELECT letter_grade_id FROM schedul WHERE letter_grade_id=? AND day_title=? AND company_id=?"
    let already={}

        try{
        // check if data is exist in this schoole
        array_Letter_id.forEach( letterId=> 
         {
             // Convert the Letter ID to an integer if needed
            dbPool.query(checkDataExist,[comp_id,letterId],(error,result)=>{
                if(error){
                    console.log(error)
                    return res.status(400).json({error:error['sqlMessage']})
                }
                if(result.length==0){
                   // return res.status(400).json({error:"This section is not registered before"})
                }
                       // check if schedule exits before
                array_day_title.forEach(day_title=>
                    {
                        dbPool.query(selectQuery,[letterId,day_title,comp_id],(error,result)=>{
                         if(error){
                            console.log(error)
                             return res.status(400).json({error:error['sqlMessage']})
                         }
                         if(result.length>0){
                             already[letterId]=letterId
                             return
                         //   return res.status(400).json({error:"Schedule already exist"})
                         }
                         // if not exist register now
                         dbPool.query(insertQuery,[letterId,day_title,comp_id],(error,result)=>{
                             if(error){
                             return res.status(400).json({error:error['sqlMessage']})
                             }
                             });
                           })
                            })
                      })
                    })
          return  res.status(200).json({data:"Schedule registered successfuly"}) 
        
 
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:error})
    }
}
module.exports={getSchedule,getSchedules,registerSchedule,getAssignSchedule}