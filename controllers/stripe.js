
const db = require("../models");
const User = db.user;
const StripeSubscription = db.stripeSubscription;
const Plan = db.plan;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_KEY);




exports.stripeSubscription = async (req,res)=>{
  //return res.json(req.body);
  card =  {
    number: req.body.number,
    exp_month: req.body.exp_month,
    exp_year: req.body.exp_year,
    cvc: req.body.cvc,
  }

  

  await stripe.paymentMethods.create({
      type: 'card',
      card: card,
      billing_details: {
        name: req.body.billing_details_name,
      },
    })
    .then( async (result) => {
      
      if (result.error) {
       // displayError(result);

      } else {
          public_id = req.body.public_id;
          customerId =  req.body.customerId;
          paymentMethodId = result.id;
          priceId = req.body.priceId;
          try {
            await stripe.paymentMethods.attach(paymentMethodId, {
              customer: customerId,
            });
          } catch (error) {
            return res.status('402').send({ error: { message: error.message } });
          }
        
          // Change the default invoice settings on the customer to the new payment method
          await stripe.customers.update(
            customerId,
            {
              invoice_settings: {
                default_payment_method: paymentMethodId,
              },
            }
          );
        
          // Create the subscription
          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            expand: ['latest_invoice.payment_intent'],
          });
        
          
          guid = uuidv4();
                guid = guid.replace(/-/g,"");
          subscription_data = {
            guid : guid,
            subscription_id : subscription.id,
            object : subscription.object,
            application_fee_percent : subscription.application_fee_percent,
            billing_cycle_anchor : subscription.billing_cycle_anchor,
            billing_thresholds : subscription.billing_thresholds,
            cancel_at : subscription.cancel_at,
            cancel_at_period_end : subscription.cancel_at_period_end,
            canceled_at : subscription.canceled_at,
            collection_method : subscription.collection_method,
            public_id : public_id,
            plan_id : priceId,
            customer_stripe_id : customerId, 
            status : subscription.status,
            latest_invoice_payment_intent_status : subscription.latest_invoice.payment_intent.status
          }
          //return res.json(subscription_data);
          await StripeSubscription.create(subscription_data).then(  data => {}).catch(err => {
            res.status(500).send({
              message:
                err.message || "Something went wrong."
            });
          }); 
          
          
          
          if(subscription.status=='active'){
            await Plan.findOne({ where: { price_id: priceId } }).then( async data => {
              await User.update({plan_status:data.type},{ where: { guid: public_id },})
            }).catch(err => {
              res.status(500).send({
                message:
                  err.message || "Something went wrong."
              });
            });   
            res.json({message:"Successfully Subscribed."});
          }else{
            res.status(401).json({message:"The card was declined (that is, insufficient funds, card has expired, etc)"});
          }
       //   res.send(subscription);
      }
    });
}
