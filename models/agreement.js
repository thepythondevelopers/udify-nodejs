const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;            
const aggrementschema = new Schema({            
  user: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  supplier: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  status:{
    type: Boolean,
    default: 1
  }
},{timestamps: true});

module.exports = mongoose.model("Agreement",aggrementschema);