const dbPool=require("../config/dbConfig")
const moment=require("moment")
const getScheduleTimes=(req,res)=>{
    try{
     dbPool.query(' SELECT * FROM schedule_time',(error,result)=>{
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

const getScheduleTime=(req,res)=>{
    const {id}=req.params
    const company_id=req.id
    try{
    dbPool.query(' SELECT * FROM schedul_time WHERE id=? AND company_id=?',[id,company_id],(error,result)=>{
        if(error){
            return res.status(400).json({error:error['sqlMessage']})
        }
        if(result.length==0){
            return res.status(400).json({error:"Schedule time not found"})
        }
        return res.status(200).json({data:result})
    });
    }
    catch(error){
        res.status(400).send({error:error})
    }
}


// get schedule time for assign
const getAssignScheduleTime=(req,res)=>{
    const company_id=req.id
     const selectQuery='SELECT s.id,TIME_FORMAT(s.start_time, "%H:%i") as start_time,TIME_FORMAT(s.end_time, "%H:%i") as end_time FROM schedule_time AS s WHERE s.company_id=?'
         try{
                 dbPool.query(selectQuery,[company_id],(error,result)=>{
                     if(error){
                         return res.status(400).json({error:error['sqlMessage']})
                     }
                     // make suitable to return schedule data
                     const schedule__time_data=result.map(function(schedule){
                         return {
                             label:schedule.start_time +" -- "+schedule.end_time,
                             id:schedule.id
                         }
                     })
                     return res.status(200).json({schedule_time_data:schedule__time_data})
                    });
         
                 }
         catch(error){
             res.status(400).send({error:error})
         }
     }

// register schedule time
const registerScheduleTime=(req,res)=>{
const {start_time,end_time}=req.body
const comp_id=req.id
const time1=moment(start_time,"HH:mm")
const time2=moment(end_time,"HH:mm")
const time_difference=time2.diff(time1,'minutes')
// if end of period is lessthan start time 
if(time_difference<40){
    return res.status(400).json({error:"End time should be greater than start time"})
}
  
const insetQuery="INSERT INTO schedule_time(start_time,end_time,company_id)  VALUES(?,?,?)"
const selectQuery="SELECT * FROM schedule_time WHERE start_time=? AND end_time=? AND company_id=?"
    try{
        // check time is exist or not
        dbPool.query(selectQuery,[start_time,end_time,comp_id],(error,result)=>{ 
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            if(result.length>0){
                return res.status(400).json({error:"Schedule time is already exist"})
            }
            dbPool.query(insetQuery,[start_time,end_time,comp_id],(error,result)=>{
            if(error){
                return res.status(400).json({error:error['sqlMessage']})
            }
            return res.status(200).json({data:"Schedule time regostered successfuly"})
        });
        })
    }
    catch(error){
        res.status(400).send({error:error})
    }
}
module.exports={getScheduleTime,getScheduleTimes,registerScheduleTime,getAssignScheduleTime}