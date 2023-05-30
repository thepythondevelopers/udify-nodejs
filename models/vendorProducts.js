const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;   
const mongoosePaginate = require('mongoose-paginate-v2');
const VendorProductSchema = new Schema({  
    user_id:{
        type : ObjectId,
        ref: "User",
        //required : true
    },
    integration_id:{
        type : ObjectId,
        ref: "Integration",
        //required : true
    },
      store_id : {
        type: String,
        //required : true
    },
    body_html: {
        type: String
      },
      handle: {
        type: String
    },
    id :{
        type: String,
        required : true
    },
    images:{
        type: Array
    },
    options:{
        type: String
    },
    product_type:{
        type: String
    },
    published_at:{        
        type: Date,
    },
    published_scope:{
        type: String
    },
    tags:{
        type: String
    },
    template_suffix:{
        type: String
    },
    title:{
        type: String
    },
    metafields_global_title_tag:{
        type: String
    },
    metafields_global_description_tag:{
        type: String
    },
    vendor:{
        type: String
    },
    status:{
        type: String
    },
    source:{
        type: String,
        default: 'Shopify'
    },
    sys_updated_at:{
        type: Date,
        default: Date.now
    }
      
    },{timestamps: true});

    // ProductSchema.virtual('ProductVariant', {
    //     ref: 'ProductVariant',
    //     localField: 'id',
    //     foreignField: 'product_id'
    //   });
    VendorProductSchema.plugin(mongoosePaginate);
    module.exports = mongoose.model("vendorProducts",VendorProductSchema);