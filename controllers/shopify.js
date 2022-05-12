const Shopify = require('shopify-api-node');
const db = require("../models");
require('dotenv').config();
const Integration = db.integration;
const Product = db.product;
const ProductCustomData = db.productCustomData;
const ProductVariant = db.productVariant;
const Customer = db.customer;
const { v4: uuidv4 } = require('uuid');
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
      { id: { [Op.like]: `%${search_string}%` } },
      { product_type: { [Op.like]: `%${search_string}%` } },
      { body_html: { [Op.like]: `%${search_string}%` } },
      { status: { [Op.like]: `%${search_string}%` } },
      
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
      { id: { [Op.like]: `%${search_string}%` } },
      { product_type: { [Op.like]: `%${search_string}%` } },
      { body_html: { [Op.like]: `%${search_string}%` } },
      { status: { [Op.like]: `%${search_string}%` } },
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
        { last_name: { [Op.like]: `%${search_string}%` } },
        { shopify_id: { [Op.like]: `%${search_string}%` } },
        { email: { [Op.like]: `%${search_string}%` } },
        { address_line1: { [Op.like]: `%${search_string}%` } },
        { address_line2: { [Op.like]: `%${search_string}%` } },
        { city: { [Op.like]: `%${search_string}%` } },
        { province: { [Op.like]: `%${search_string}%` } },
        { country: { [Op.like]: `%${search_string}%` } },
        { zip: { [Op.like]: `%${search_string}%` } },
        { phone: { [Op.like]: `%${search_string}%` } },       

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
        { last_name: { [Op.like]: `%${search_string}%` } },
        { shopify_id: { [Op.like]: `%${search_string}%` } },
        { email: { [Op.like]: `%${search_string}%` } },
        { address_line1: { [Op.like]: `%${search_string}%` } },
        { address_line2: { [Op.like]: `%${search_string}%` } },
        { city: { [Op.like]: `%${search_string}%` } },
        { province: { [Op.like]: `%${search_string}%` } },
        { country: { [Op.like]: `%${search_string}%` } },
        { zip: { [Op.like]: `%${search_string}%` } },
        { phone: { [Op.like]: `%${search_string}%` } },
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
            "send_email_invite": true
          }
          
          
          customer =  await shopify.customer.create(customer_data);
          
          const store_id = data.store_id;
          guid = uuidv4();
              guid = guid.replace(/-/g,"");
              customer_content = {
                guid : guid,
                store_id : store_id,
                first_name : customer.first_name,
                last_name : customer.last_name,
                created_at : customer.created_at,
                updated_at : customer.updated_at,
                accepts_marketing : customer.accepts_marketing,
                email : customer.email,
                orders_count : customer.orders_count,
                total_spent : customer.total_spent,
                tax_exempt : customer.tax_exempt,
                shopify_id : customer.id,
                company : customer.default_address.company,
                address_line1 : customer.default_address.address1,
                address_line2  : customer.default_address.address2,
                city : customer.default_address.city,
                province : customer.default_address.province,
                country : customer.default_address.country,
                zip : customer.default_address.zip,
                phone : customer.default_address.phone,
                province_code : customer.default_address.province_code,
                country_code : customer.default_address.country_code,
                country_name : customer.default_address.country_name,
                default : customer.default_address.default,
                state :  customer.state       
              }

            await   Customer.create(customer_content);

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
          Customer.destroy({
            where: {
                shopify_id : req.params.customer_id
            }
        })
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
          
              customer_content = {
                first_name : customer.first_name,
                last_name : customer.last_name,
                created_at : customer.created_at,
                updated_at : customer.updated_at,
                accepts_marketing : customer.accepts_marketing,
                email : customer.email,
                orders_count : customer.orders_count,
                total_spent : customer.total_spent,
                tax_exempt : customer.tax_exempt,
                shopify_id : customer.id,
                company : customer.default_address.company,
                address_line1 : customer.default_address.address1,
                address_line2  : customer.default_address.address2,
                city : customer.default_address.city,
                province : customer.default_address.province,
                country : customer.default_address.country,
                zip : customer.default_address.zip,
                phone : customer.default_address.phone,
                province_code : customer.default_address.province_code,
                country_code : customer.default_address.country_code,
                country_name : customer.default_address.country_name,
                default : customer.default_address.default,
                state :  customer.state       
              }

              await   Customer.update(customer_content,{where: { shopify_id: customer.id }}); 
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


exports.deleteProductShopify = async (req,res) =>{
  
  try {
    const id = req.params.integration_id;
    Integration.findByPk(id)
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          product =  await shopify.product.delete(req.params.product_id);

          Product.destroy({
            where: {
                id : req.params.product_id
            }
        })
          return res.json({message : "Product Deleted Successfully."});
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

exports.createProductShopify = async (req,res) =>{
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
          product_data = {
              "title": req.body.title,
              "body_html": req.body.body_html,
              "vendor": req.body.vendor,
              "product_type": req.body.product_type
          }
          
          
          product =  await shopify.product.create(product_data);
           
          const store_id = data.store_id;
            guid = uuidv4();
            guid_product = guid.replace(/-/g,"");
            product_content = {
                guid: guid_product,
                store_id : store_id,
                body_html:product.body_html,
                handle: "",
                id  : product.id,
                images : JSON.stringify(product.images),
                options:JSON.stringify(product.options),
                product_type:product.product_type,
                published_at : product.published_at,
                published_scope:product.published_scope,
                tags:product.tags,
                template_suffix:product.template_suffix,
                title:product.title,
                metafields_global_title_tag:"",
                metafields_global_description_tag:"",
                vendor:product.vendor,  
                status:product.status
            };
          
            await   Product.create(product_content);
          return res.json({message : "Product Created Successfully."});
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

exports.image = async (req,res) =>{
  return res.json(req.file);
}