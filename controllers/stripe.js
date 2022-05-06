
const db = require("../models");
const User = db.user;
const UserToken = db.userToken;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.createCustomerAndSubscription = (req,res)=>{
    
    return stripe.customers.create({
    source: req.body.stripeToken,
    email: req.body.customerEmail
  }).then(customer => {
    stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          plan: req.body.planId
        }
      ]
    });
  });
}