const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;      
const accountSchema = new Schema({   
      
      name:{
        type: String,
        trim: true
      },
      api_token:{
        type: String
      },
      user_id:{
        type : ObjectId,
        ref: "User",
        required : true
    },
	address_street:{
        type: String
    },
	address_unit:{
        type: String
    },
	address_city:{
        type: String
    },
	address_state:{
        type: String
    },
	address_zip:{
        type: String
    },
	address_country:{
        type: String
    },
	stripe_customer_id:{
        type: String,
    },
    location:{
      type: String
    },
    website:{
      type: String
    },
    about:{
      type: String
    },
    avatar:{
      fileId: {
          type: String
        },
        filename: {
          type: String
        }
    },
    cover:{
      fileId: {
        type: String
      },
      filename: {
        type: String
      }
    },
    vendor_email:{
      type: String
    },
    store_name:{
      type: String
    },
    phone:{
      type : Number
    },
    title:{
      type: String
    },
    company:{
      type: String
    },
    stripe_secret_key:{
      type: String
    },
    stripe_publishable_key:{
      type: String
    },
    deleted_at:{
      type: Date
    },
    prof_img:{
      type:String
    }
      
    },{timestamps: true});

module.exports = mongoose.model("Account",accountSchema);