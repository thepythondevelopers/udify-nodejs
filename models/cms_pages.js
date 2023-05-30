const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CmsPageSchema = new Schema({
      type :{
        type: String,
        required : true,
      },
      data :{
        type: String,
        required : true,
        set: stringify,
        get : parse
      }
      
    },{timestamps: true});


  function stringify(value) {
    return data = JSON.stringify(value);
  }
  function parse(value){
    string_data = this.getDataValue('data');
            return JSON.parse(string_data);
  }

module.exports = mongoose.model("CmsPage",CmsPageSchema);