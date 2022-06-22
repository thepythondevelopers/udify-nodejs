const stripe = require('stripe')(process.env.STRIPE_KEY);
const db = require("../models");
const Plan = db.plan;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const moment= require('moment')

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
    name: req.body.name,
    default_price_data: {
      unit_amount: req.body.price*100
    }
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
          status: 0}
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

exports.activePlan = (req,res)=>{
  const app_id = req.params.app_id;    
  Plan.update(
    {status:0},
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
    {status:1},
    { where: { app_id: "prod_LutpoZhen4avJU"}
   }
  )
  .then(data => {
    return res.json({message : "Inactive Plan Successfully."});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating Integration."
    });
  });
}


exports.test = async (req,res)=>{
  

  
  var utcStart = moment().unix();
  const myDate = moment.unix(1653410499).utc().format('DD/MM/YYYY H:m:s A')
    return res.json(myDate);
  const subscription = await stripe.subscriptions.retrieve(
    'sub_1L30nfKBofR9uVRpzQKzAlFK'
  );
  return res.json(subscription);
}