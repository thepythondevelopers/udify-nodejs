const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const gallerySchema = new Schema({  
      supplier_id:{
        type: String,
        required : true
      },
      prod_img:[""]
    });
    gallerySchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Gallery",gallerySchema);