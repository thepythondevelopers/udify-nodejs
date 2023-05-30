const stripe = require('stripe')(process.env.STRIPE_KEY);
const {validationResult} = require("express-validator");
const stripeSubscription = require("../../models/stripeSubscription");
const Plans = require("../../models/plans");

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
  await Plans
  .create(data)
  .then(plan => {
    return res.json({message : "Save Successfully."});
  }).catch((err)=>{
    return res.status(400).json({
        message : "Unable to save in db",
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
    price_id : product.default_price,
    type : req.body.type,
    
    features : req.body.features
  }
  
  await Plans.findOneAndUpdate(
    { app_id: product.id},
    {$set : data},
    {new: true},
    (err,plan) => {
        if(err){
            return res.status(400).json({
                message : "Unable to save in db",
                error : err 
            })
        
        }

        if(plan===null){
            return res.status(404).json({
                message : "No Data Found"
            })
        }

        return res.json({message : "Update Successfully."});
    }
    )

}  

exports.getPlan = (req,res)=>{
    
    Plans.find({status: 1}).then(data => {
        return res.json(data);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while getting Plan."
        });
      });
}

exports.getPlanAdmin = (req,res)=>{
    
  Plans.find().then(data => {
      return res.json(data);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while getting Plan."
      });
    });
}

exports.activePlan = async (req,res)=>{
  const app_id = req.params.app_id;    
  await Plans.findOneAndUpdate(
    {  app_id: app_id},
    {$set : {status:1}},
    {new: true},
    (err,plan) => {
        if(err){
            return res.status(400).json({
                message : "Unable to save in db",
                error : err 
            })
        
        }

        if(plan===null){
            return res.status(404).json({
                message : "No Data Found"
            })
        }

        return res.json({message : "Active Plan Successfully."});
    }
    )

}

exports.inactivePlan = async (req,res)=>{
  const app_id = req.params.app_id;    
   
  await Plans.findOneAndUpdate(
    {  app_id: app_id},
    {$set : {status:0}},
    {new: true},
    (err,plan) => {
        if(err){
            return res.status(400).json({
                message : "Unable to save in db",
                error : err 
            })
        
        }

        if(plan===null){
            return res.status(404).json({
                message : "No Data Found"
            })
        }

        return res.json({message : "Inactive Plan Successfully."});
    }
    )
}

exports.checkSubscriptionStatus = async (req,res)=>{
  
  payment_status = await stripeSubscription.find({ public_id:req.user._id }).sort({ "created_at":-1});
  s = payment_status!=null ? payment_status.status : "";
  return res.json({status : s});
}

