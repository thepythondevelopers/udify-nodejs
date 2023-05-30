const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema; 
const plansSchema = new Schema({      
      name: {
        type: String,
        required : true
      },
      app_id: {
        type: String,
        required : true
      },
      price_id: {
        type: String,
        required : true
      },
      type: {
        type: String,
        required : true
      },
      price: {
        type: Number,
        required : true
      },
      features: {
        type: String,
        required : true
      },
      status: {
        type: Number,
        required : true,
        default: 1
      }    
    },{timestamps: true});

module.exports = mongoose.model("Plans",plansSchema);