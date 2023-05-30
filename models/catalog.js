const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;            
const catlogchema = new Schema({            
  user_id: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  product_id:{
    type: Array,
    required : true
  }
},{timestamps: true});

module.exports = mongoose.model("Catalog",catlogchema);