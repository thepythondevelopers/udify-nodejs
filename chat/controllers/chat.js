const User = require("../../models/user");
const Chat = require("../../models/chat");
const {validationResult} = require("express-validator");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.saveChat = async (req,res) =>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
              
    
    content = {
        send_by : req.user._id,
        send_to : req.body.send_to,
        message : req.body.message
    }  
    
    chat =new Chat(content);
    chat.save((err,chat)=>{
        if(err){
            return res.status(400).json({
                message : err
            })
        }
        return res.json(content);
    })          
      
}

exports.getChat = async (req,res) =>{
  
         
      user_id = req.params.user_id;
    result = await Chat.aggregate([
        { $match: {
          $or : [
            { $and : [{ send_by: ObjectId(req.user._id) }, { send_to: ObjectId(user_id) }] },
            { $and : [ { send_by: ObjectId(user_id) },{ send_to: ObjectId(req.user._id) } ] }
        ]
         } },
        {$sort: {_id: 1}},
        { $group: { _id :{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} },doc: { $push : "$$ROOT" } } },
        {$sort: {_id: 1}},
        
        
      ])     
     return res.json(result);    
        
  }
  exports.getUserList = async (req,res) =>{
    user = await User.find({'access_group': 'user'}).select('-password');
    return res.json(user);    
  }

  exports.getSupplierList = async (req,res) =>{
    user = await User.find({'access_group': 'supplier'}).select('-password');
    return res.json(user);    
  }

exports.chatNotification = async (req,res) =>{
    chat_notification = await Chat.aggregate([
      { $match: {
        send_to : ObjectId(req.user._id)
       } },
       
       
   { $group: { _id :{ send_by: "$send_by" },count:{$sum:1} } },
   { "$lookup": {
    "from": "users",
    "localField": "_id.send_by",
    "foreignField": "_id",
    "as": "from"
}}, 
    ])     
    return res.json(chat_notification);    
  }  

exports.markChatRead = async (req,res) =>{
  update_content ={
    read :1
  }
  await Chat.findOneAndUpdate(
    {send_to: req.user._id,send_by: req.params.send_by},
    {$set : update_content},
  )
  return res.json({Message : "Messages are read."});
}