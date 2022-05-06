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
const moment= require('moment') 
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