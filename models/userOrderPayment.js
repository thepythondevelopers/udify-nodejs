const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;    
const userOrderPaymentSchema = new Schema({            
    
  shopify_order_id :{
    type: String,
    required : true
  },
  status : {
    type: String,
    required : true
  },
  customer_id : {
    type : String,
    required : true
  }
},{timestamps: true});

module.exports = mongoose.model("UserOrderPayment",userOrderPaymentSchema);