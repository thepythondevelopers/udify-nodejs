const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const OrderSchema = new Schema({
    user:{
        type : ObjectId,
        ref: "User"
    },
      store_id: {
        type: String,
        required : true
      },     
      subtotal: {
        type: String,
        required : true
      },
      integration_id:{
        type : ObjectId,
        ref: "Integration"
      },
    //   subtotal: {
    //     type: String,
    //     required : true
    //   },
      total: {
        type: String,
        required : true
    },
    created_at:{
        type: Date
    },
    updated_at:{
        type: Date
    },
      closed_at: {
        type: Date
      },
      shopify_order_id: {
        type: String,
        required : true
      },
      note: {
        type: String
     },
     token: {
        type: String
    },
    gateway: {
        type: String
    },
    total_weight: {
        type: Number  
    },
    total_tax: {
        type: String
    },
    taxes_included: {
        type: Boolean 
    },
    currency: {
        type: String
    },
    financial_status: {
        type: String
    },
    confirmed: {
        type: Boolean
    },
    total_discounts: {
        type: String
    },
    total_line_items_price: {
        type: String
    },
    cart_token: {
        type: String
    },
    name: {
        type: String
    },
    cancelled_at: {
        type: Date
    },
    cancel_reason: {
        type: String
    },
    total_price_usd: {
        type: String
    },
    checkout_token: {
        type: String
    },
    processed_at: {
        type: Date
    },
    device_id: {
        type: String
    },
    app_id: {
        type: Number
    },
    browser_ip: {
        type: String
    },
    fulfillment_status: {
        type: String
    },
    order_status_url: {
        type: String
    },
    customer_id: {
        type: String
    },
    variant_ids: {
        type: String
    },
    product_ids: {
        type: String
    },
    line_items : {
        type: Array
    },
    sys_updated_at: {
        type: Date,
        default: Date.now   
    }

    },{timestamps: true});
   // OrderSchema.index({ name: 'text', total: 'text', subtotal: 'text' })
    OrderSchema.plugin(aggregatePaginate);
    OrderSchema.plugin(mongoosePaginate);
    
    module.exports = mongoose.model("Order",OrderSchema);