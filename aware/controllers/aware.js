const User = require("../../models/user");
const {validationResult} = require("express-validator");

exports.getNotification = async (req,res) => {
    User.findOne({email:req.user.email}).exec(async (err,user)=>{
        if(err){
            return res.status(400).json({
                message : "Something Went Wrong"
            })
        }
        else if(user){
            return res.status(200).json({"notification":user.notification_email_list});
            
        }else{
            return res.status(400).json({"msg":"No such user found"});
        }
        
    })    
}

exports.deleteNotification = async (req,res) => {

    User.findOne({email:req.body.email}).exec(async (err,data)=>{
        if(err){
            return res.status(500).json({
                message : "Innternal Server Error"
            })
        }
        else if(data){
            let check = await User.updateOne(
                {email:req.body.email},
                {$pull : {notification_email_list:{notf_id:req.body.notf_id}}}
                )
            return res.status(200).json({"msg":"Notification deleted successfully"});
            
        }else{
            return res.json({"msg":"Invalid request"});
        }
        
    })       

}

exports.sendNotification = async (req,res) =>{

if(!req.body.msg) 
return res.status(400).json({"msg":"Invalid Credentials"});
if(!req.body.email)
return res.status(400).json({"msg":"Invalid Credentials"});
else{
 const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }

    User.findOne({email:req.body.email}).exec(async (err,user)=>{
        if(err){
            return res.status(400).json({
                message : "Something Went Wrong"
            })
        }
        if(user){
            var msg = req.body.msg[0];
            msg.id = req.user._id;
            await User.updateOne(
                {email:req.body.email},
                {$push : {notification_email_list:msg}}
                )
            return res.status(200).json({"msg":"Notification send successfully"});
            
        }else{
            return res.json({"msg":"No such user found"});
        }
        
    })    
}      
      
}

