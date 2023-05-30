const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;
const ProductVariantSchema = new Schema({        
      store_id:{
        type: String,
        required : true
      },
      product_id:{
        type: String
      },
      barcode:{
        type: String
      },
      compare_at_price:{
        type: String
      },
      fulfillment_service:{
        type: String
      },
      grams:{
        type: Number
      },
      weight:{
        type: Number
      },
      weight_unit:{
        type: String
      },
      id:{
        type: String
      },
      inventory_item_id:{
        type: String
      },
      inventory_management:{
        type: String
      },
      inventory_policy:{
        type: String
      },
      inventory_quantity:{
        type: Number
      },
      option1:{
        type: String
      },
      option2:{
        type: String
      },
      option3:{
        type: String
      },
      position:{
        type: Number
      },
      price:{
        type: String
      },
      presentment_prices:{
        type: String
      },
      shopify_product_id:{
        type: String
      },
      requires_shipping:{
        type: Boolean
      },
      sku:{
        type: String
      },
      taxable:{
        type: Boolean
      },
      title:{
        type: String
      },
      image_id:{
        type: String
      },
      supplier_id:{
        type : ObjectId,
        ref: "User"
    },
      created_at:{
        type: Date
      },
      sys_updated_at:{
        type: Date,
        default: Date.now
      } 
      
    },{timestamps: true});

    module.exports = mongoose.model("ProductVariant",ProductVariantSchema);