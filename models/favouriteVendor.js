const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;    
const favouriteVendorSchema = new Schema({            
  user_id: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  supplier_id: {
    type : ObjectId,
    ref: "User",
    required : true
  }
},{timestamps: true});

module.exports = mongoose.model("FavouriteVendor",favouriteVendorSchema);