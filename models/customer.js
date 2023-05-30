const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const {ObjectId} = mongoose.Schema;
const CustomerSchema = new Schema({      
    user:{
        type : ObjectId,
        ref: "User"
    },
    store_id: {
        type: String,
        required : true
      },
      created_at:{
        type: Date
    },
    updated_at:{
        type: Date
    },
      first_name: {
        type: String
      },
      last_name: {
        type: String
      },     
      accepts_marketing:{
        type: Boolean
      },
     email:{
        type: String
     },
    orders_count:{
        type: Number
    },
    total_spent:{
        type: Number
    },
    tax_exempt:{
        type: Boolean,
        default: 0
    },
    shopify_id:{
        type: String
    },
    company:{
        type: String
    },
    address_line1:{ 
        type: String
    },
    address_line2:{
        type: String
    },
    city:{
        type: String
    },
    province:{
        type: String
    },
    country:{
        type: String
    },
    zip:{
        type: String
    },
    phone:{
        type: String
    },
    province_code:{
        type: String
    },
    country_code:{
        type: String
    },
    country_name:{
        type: String
    },
    default:{
        type: Boolean
    },
    state:{
      type: String
  },
    sys_updated_at:{
        type: Date,
        default: Date.now
    } 

    },{timestamps: true});
    CustomerSchema.plugin(mongoosePaginate);
    module.exports = mongoose.model("Customer",CustomerSchema);