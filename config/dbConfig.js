const mysql =require("mysql2");

const dbConfig=()=>{
    try{
      const mySqlPool=  mysql.createPool({
            host:"localhost",
            user:"root",
            password:'',
            database:"myschool"
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