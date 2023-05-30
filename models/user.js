const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const userSchema = new Schema({
      
      first_name:{
        type: String,
        required : true
      },
    last_name:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true,
        unique: true
    },
    phone:{
        type: Number
    },
    password:{
        type: String
    },
    access_group:{
        type: String, 
        enum : ['retailer','supplier','admin','owner','user'], 
        default: 'user'
    },
    server_admin:{
        type: Number,
        default: 0
    },
    password_reset_token:{
        type: String
    },
    daily_reports:{
        type: Number,
        default: 0
    },
    monthly_reports:{
        type: Number,
        default: 0
    },
    notification_email_list:{
        type: Array,
        default:[{"body":String,"Send_by":String,"email":String,"date":String,"notf_id":Number}]
    },
    onboarding:{
        type: Number,
        default: 0
    },
    plan_status:{
        type: String, 
        enum : ['trial','basic','pro','enterprise'], 
        default: 'trial'
    },
    user_status:{
        type: String, 
        enum : ['Active','Inactive'], 
        default: 'Inactive'
    },
    deleted_at:{
        type: Date
      },
      account_id:{
        type : ObjectId,
        ref: "Account"
      } 
      
    },{timestamps: true});
    userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User",userSchema);