const stripe = require('stripe')(process.env.STRIPE_KEY);
const db = require("../models");
const Plan = db.plan;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const moment= require('moment')
const StripeSubscription = db.stripeSubscription;
const { v4: uuidv4 } = require('uuid');

exports.createPlan = async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }  
  
  const product = await stripe.products.create({
    name: req.body.name,
    default_price_data: {
      unit_amount: req.body.price*100,
      currency: 'usd',
      recurring: {interval: 'month'},
    },
    expand: ['default_price'],
  });
  data = {
    name : req.body.name,
    app_id : product.id,
    price_id : product.default_price.id,
    type : req.body.type,
    price : req.body.price,
    features : req.body.features
  }
  await Plan
  .create(data)
  .then(plan => {
    return res.json({message : "Save Successfully."});
  }).catch((err)=>{
    return res.status(400).json({
        message : "Unable to sabe in db",
        error : err 
    })
  })
  
}
exports.updatePlan = async (req,res)=>{
  const app_id = req.params.app_id;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }  
  const product = await stripe.products.update(app_id, {
    name: req.body.name
  });

  data = {
    name : req.body.name,
    app_id : product.id,
    price_id : product.default_price.id,
    type : req.body.type,
    price : req.body.price,
    features : req.body.features
  }
  
  Plan.update(
    data,
    { where: { app_id: product.id}
   }
  )
  .then(plan => {
    return res.json({message : "Update Successfully."});
  }).catch((err)=>{
    return res.status(400).json({
        message : "Unable to sabe in db",
        error : err 
    })
  })

}  

exports.getPlan = (req,res)=>{
    
    Plan.findAll({
      where: {
          status: 1}
    }).then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while getting Plan."
        });
      });
}

exports.getPlanAdmin = (req,res)=>{
    
  Plan.findAll().then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting Plan."
      });
    });
}

exports.activePlan = (req,res)=>{
  const app_id = req.params.app_id;    
  Plan.update(
    {status:1},
    { where: { app_id: app_id}
   }
  )
  .then(plan => {
    return res.json({message : "Active Plan Successfully."});
  }).catch((err)=>{
    return res.status(400).json({
        message : "Unable to sabe in db",
        error : err 
    })
  })
}

exports.inactivePlan = async (req,res)=>{
  const app_id = req.params.app_id;    
   
  Plan.update(
    {status:0},
    { where: { app_id: app_id}
   }
  )
  .then(data => {
    return res.json({message : "Inactive Plan Successfully."});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred."
    });
  });
}

exports.checkSubscriptionStatus = async (req,res)=>{
  
  payment_status = await StripeSubscription.findOne({
    where: { public_id:req.user.id },
    order: [ [ 'created_at', 'DESC' ]],
  });
  s = payment_status!=null ? payment_status.status : "";
  return res.json({status : s});
}  
exports.test = async (req,res)=>{
  

  subscription_result = await StripeSubscription.findAll({where:{check_status:0}}); 
  
  for(const data of subscription_result) {
    var time = moment().unix();  
    if(data.current_period_end<time){
      const subscription = await stripe.subscriptions.retrieve(
        data.subscription_id
      );

      guid = uuidv4();
      guid = guid.replace(/-/g,"");
      subscription_data = {
        guid : guid,
        subscription_id : subscription.id,
        object : subscription.object,
        application_fee_percent : subscription.application_fee_percent,
        billing_cycle_anchor : subscription.billing_cycle_anchor,
        created : subscription.created,
        current_period_end : subscription.current_period_end,
        current_period_start : subscription.current_period_start,
        billing_thresholds : subscription.billing_thresholds,
        cancel_at : subscription.cancel_at,
        cancel_at_period_end : subscription.cancel_at_period_end,
        canceled_at : subscription.canceled_at,
        collection_method : subscription.collection_method,
        public_id : data.public_id,
        plan_id : data.plan_id,
        customer_stripe_id : data.customer_stripe_id, 
        status : subscription.status,
        latest_invoice_payment_intent_status : ''
      }
      
      await StripeSubscription.create(subscription_data).then(  data => {}).catch(err => {
        res.status(500).send({
          message:
            err.message || "Something went wrong."
        });
      });
      if(subscription.status!='active'){
        console.log('Issue');
      }
      await   StripeSubscription.update({check_status:1},{where: { guid: data.guid }});
      
    }
    return res.json({message : "Process Done"});
  }
  
  // var utcStart = moment().unix();
  // const myDate = moment.unix(1653410499).utc().format('DD/MM/YYYY H:m:s A')
    
  // const subscription = await stripe.subscriptions.retrieve(
  //   'sub_1LDMPvKBofR9uVRpuFAni2X2'
  // );
  // return res.json(subscription);
}