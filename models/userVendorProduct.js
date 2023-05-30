const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;    
const userVendorProductSchema = new Schema({            
  user_id: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  supplier_id: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  supplier_product_id :{
    type: String,
    required : true
  },
  product_id: {
    type: String,
    required : true
  },
  store_id : {
    type: String,
    required : true
  },
  integration_id :{
    type : ObjectId,
    ref: "Integration",
    required : true
  }
},{timestamps: true});

module.exports = mongoose.model("UserVendorProduct",userVendorProductSchema);