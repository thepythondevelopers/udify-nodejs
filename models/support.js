const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;      
const supportSchema = new Schema({         
      user_id: {
        type : ObjectId,
        ref: "User"        
      },
      parent_id :{
        type : ObjectId,
        ref: "Support"
      },
      name: {
        type: String
      },
      subject: {
        type: String,
      },
      email: {
        type: String,
      },
      message:{
        type: String,
        required : true
      },
      status: {
        type: String,
        required : true,
        default: 'New'
      },
      file: {
        type: String
      },
      admin_read:{
        type: Number,
        required : true
      },
      user_read:{
        type: Number,
        required : true
      },
      category: {
        type: String,
      },
      status_by: {
        type: String,
      },
      status_at: {
        type: Date,
      }  
    },{timestamps: true});

    module.exports = mongoose.model("Support",supportSchema);