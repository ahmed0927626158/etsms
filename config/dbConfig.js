const mysql =require("mysql2");

const dbConfig=()=>{
    try{
      const mySqlPool=  mysql.createPool({
            host:"bu4uqfpa88bdolzxu9ki-mysql.services.clever-cloud.com",
            user:"uiurvzcb1jhhm0aw",
            password:'3ZYMghvQUgoDmhX1QV4c',
            database:"bu4uqfpa88bdolzxu9ki"
        })
        if (mySqlPool){
            console.log("DB Connected")
        }
        return mySqlPool;
    }
    catch(error){
        throw new Error("DB is not connected "+error)
    }
}
module.exports =dbConfig()
