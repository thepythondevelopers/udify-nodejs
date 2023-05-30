const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;            
const orderAssignschema = new Schema({            
  assign_by: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  assign_to: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  integration_id:{
    type : ObjectId,
    ref: "Integration",
    required : true
  },
  order_id:{
    type: String,
    required : true
  },
  store_id:{
    type: String,
    required : true
  },
  product_id:{
    type: String,
    required : true
  },
  fulfillment_status:{
    type: String,
    default : 0,
    required : true
  },
  payment_ask:{
    type:Boolean,
    default:0
  },
  tracking_number:{
    type: String
  }    
},{timestamps: true});

module.exports = mongoose.model("OrderAssign",orderAssignschema);