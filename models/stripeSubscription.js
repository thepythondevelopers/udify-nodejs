const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema; 
const StripeSubscriptionSchema = new Schema({
      subscription_id: {
        type: String,
        required : true
      },
      object: {
        type: String,
        required : true
      },
      application_fee_percent :{
        type: String
      },
      created:{
        type: String,
        required : true
      },
      billing_cycle_anchor:{
        type: String,
        required : true
      },
      current_period_end:{
        type: String,
        required : true
      },
      current_period_start:{
        type: String,
        required : true
      },
      billing_thresholds: {
        type: String
      },
      cancel_at: {
        type: String
      },
      cancel_at_period_end :{
        type: String,
        required : true
      },
      canceled_at:{
        type: String
      },

      collection_method: {
        type: String,
        required : true
      },
      public_id: {
        type : ObjectId,
        ref: "User",
        required : true
      },
      plan_id: {
        // type : ObjectId,
        // ref: "Plans",
        type : String,
        required : true
      },
      customer_stripe_id: {
        type: String,
        required : true
      },
      status: {
        type: String,
        required : true
      },
      check_status:{
        type: Number,
        required : true,
        default: 0
      },
      latest_invoice_payment_intent_status: {
        type: String,
        required : true
      }
      
    },{timestamps: true});

    module.exports = mongoose.model("StripeSubscription",StripeSubscriptionSchema);