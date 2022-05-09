const Shopify = require('shopify-api-node');
const db = require("../models");
require('dotenv').config();
const Integration = db.integration;
const Product = db.product;
const ProductCustomData = db.productCustomData;
const ProductVariant = db.productVariant;
const Customer = db.customer;
const ShopifyToken = require('shopify-token');
var pluck = require('arr-pluck');
const moment= require('moment');
const {validationResult} = require("express-validator");
//const { json } = require('body-parser');

const Op = db.Sequelize.Op;

exports.getSingleProduct = async (req,res) =>{
  const id = req.params.product_id;
  result = await Product.findAll({
    where: {id : id},
    include: [{
        model: ProductVariant
    }]
  })
  return res.json({data:result});
}

exports.getSingleCustomer = async (req,res) =>{
  const id = req.params.customer_id;
  result = await Customer.findOne({
    where: {guid : id}
  })
  return res.json({data:result});
}




exports.getProductAccordingtoStore = async (req,res) =>{
  try {  
  store_id =req.body.store_id!=null ? req.body.store_id : [];
  if(store_id==0){
    store_id = await Integration.findAll({
      attributes: ['store_id'],
      deleted_at: {
        [Op.is]: null, 
      },
      where: {account_id :req.body.account_id},
    })
    store_id = pluck(store_id, 'store_id');
  }
   


   
   
const search_string = req.body.search_string!=null ? req.body.search_string : "";
if(req.body.startedDate!=null && req.body.endDate!=null ){
  
  const startedDate = new Date(req.body.startedDate);
  const endDate = new Date(req.body.endDate);
  endDate.setDate(endDate.getDate() + 1);


  result = await Product.findAll({
    where: {store_id : {
      [Op.in]: store_id  
    },  [Op.or]: [
      { store_id: { [Op.like]: `%${search_string}%` } },
      { product_type: { [Op.like]: `%${search_string}%` } },
      { product_type: { [Op.like]: `%${search_string}%` } },
      
    ],
    
        created_at: {
       [Op.between]: [startedDate, endDate]
   }
  
  },
    include: [{
        model: ProductVariant
    }]
  })
}else{
  result = await Product.findAll({
    where: {store_id : {
      [Op.in]: store_id  
    },  [Op.or]: [
      { store_id: { [Op.like]: `%${search_string}%` } },
      { product_type: { [Op.like]: `%${search_string}%` } },
      { product_type: { [Op.like]: `%${search_string}%` } },
      
    ],
    
  },
    include: [{
        model: ProductVariant
    }]
  })
} 
  return res.json({data:result});
}  catch (err) {
    return res.status(401).send({
      message : "Something Went Wrong",
      error :err
    });
  }
}

exports.getCustomerAccordingtoStore = async (req,res) =>{
  try {
  store_id =req.body.store_id!=null ? req.body.store_id : [];
  if(store_id==0){
    store_id = await Integration.findAll({
      attributes: ['store_id'],
      deleted_at: {
        [Op.is]: null, 
      },
      where: {account_id :req.body.account_id},
    })
    store_id = pluck(store_id, 'store_id');
  }
  const search_string = req.body.search_string!=null ? req.body.search_string : "";
  if(req.body.startedDate!=null && req.body.endDate!=null ){
  
    const startedDate = new Date(req.body.startedDate);
    const endDate = new Date(req.body.endDate);
    endDate.setDate(endDate.getDate() + 1);
    result = await Customer.findAll({
      where: {store_id : {
        [Op.in]: store_id 
      },[Op.or]: [
        { store_id: { [Op.like]: `%${search_string}%` } },
        { first_name: { [Op.like]: `%${search_string}%` } },
        { last_name: { [Op.like]: `%${search_string}%` } }
      ],
      created_at: {
        [Op.between]: [startedDate, endDate]
    }
    }
    })
  }else{
    result = await Customer.findAll({
      where: {store_id : {
        [Op.in]: store_id 
      },[Op.or]: [
        { store_id: { [Op.like]: `%${search_string}%` } },
        { first_name: { [Op.like]: `%${search_string}%` } },
        { last_name: { [Op.like]: `%${search_string}%` } }
      ]}
    })
  }  
  
  return res.json({data:result});
}
catch (err) {
  return res.status(401).send({
    message : "Something Went Wrong",
    error :err
  });
}
}

exports.createCustomerShopify = async (req,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }
  try {
    const id = req.params.integration_id;
    Integration.findByPk(id)
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          customer_data = {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "email": req.body.email,
            "phone": req.body.phone,
            "verified_email": true,
            "addresses": [
              {
                "address1": req.body.address1,
                "city": req.body.city,
                "province": req.body.province,
                "zip": req.body.zip,
                "country": req.body.country
              }
            ],
            "send_email_invite": false
          }
          
          
          customer =  await shopify.customer.create(customer_data);
           return res.json({message : "Customer Created Successfully."});
        }
      }).catch(err => {
        res.status(500).send({
          message: "Error retrieving shopify account with id=" + id,
          err_m : err
        });
      }); 
  }
  catch (err) {
    return res.status(401).send({
      message : "Something Went Wrong",
      error :err
    });
  }
}

exports.deleteCustomerShopify = async (req,res) =>{
  
  try {
    const id = req.params.integration_id;
    Integration.findByPk(id)
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          customer =  await shopify.customer.delete(req.params.customer_id);
          return res.json({message : "Customer Deleted Successfully."});
        }
      }).catch(err => {
        res.status(500).send({
         
          err_m : err
        });
      });  
  }
  catch (err) {
    return res.status(401).send({
      message : "Something Went Wrong",
      error :err
    });
  }
}

exports.updateCustomerShopify = async (req,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }
  
  try {
    const id = req.params.integration_id;
    Integration.findByPk(id)
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
          customer_data = {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "email": req.body.email,
            "phone": req.body.phone,
            "verified_email": true,
            "addresses": [
              {
                "address1": req.body.address1,
                "city": req.body.city,
                "province": req.body.province,
                "zip": req.body.zip,
                "country": req.body.country
              }
            ],
            "send_email_invite": false
          }
          
          
          customer =  await shopify.customer.update(req.params.customer_id, customer_data);
           return res.json({message : "Customer Updated Successfully."});
        }
      }).catch(err => {
        res.status(500).send({
          message: "Error retrieving shopify account with id=" + id,
          err_m : err
        });
      }); 
  }
  catch (err) {
    return res.status(401).send({
      message : "Something Went Wrong",
      error :err
    });
  }
}