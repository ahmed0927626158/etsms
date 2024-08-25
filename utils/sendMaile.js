const nodemailer=require("nodemailer")
 function createTransport(){
    const transport=nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:"ahmed0927626158@gmail.com",
            pass:process.env.APP_PASSWORD
        }
    })
    
    return transport
   
}
const  sendEmail=async(email,subject,message)=>{

    if(!email){
        return  res.status(400).json({error:"Email is required"})
      }
      if(!message){
        return  res.status(400).json({error:"Message is required"})
      }
      try{
        let messageData={
            from:"ahmed0927626158@gmail.com",
            to:email,
            subject:subject,
            text:message
        }
       
        let transport= createTransport()
        const sendMail=await transport.sendMail(messageData)
       return "message has been sent"
      }
      catch(error){
        console.log(error)
       return error
      }
   

}


module.exports={sendEmail}