const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;    
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const userVendorOrderSchema = new Schema({            
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
  product_id: {
    type: String,
    required : true
  },
  shopify_order_id :{
    type: String,
    required : true
  },
  integration_id: {
    type : ObjectId,
    ref: "Integration",
    required : true
  },
  store_id: {
    type: String,
    required : true
  }
},{timestamps: true});
userVendorOrderSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("UserVendorOrder",userVendorOrderSchema);