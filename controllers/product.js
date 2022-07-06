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
const page = req.body.page!=null ? req.body.page-1 : 0;
if(req.body.startedDate!=null && req.body.endDate!=null ){
  
  const startedDate = new Date(req.body.startedDate);
  const endDate = new Date(req.body.endDate);
  endDate.setDate(endDate.getDate() + 1);

  
 
  result = await Product.findAndCountAll({
    where: {store_id : {
      [Op.in]: store_id  
    },  [Op.or]: [
      { id: { [Op.like]: `%${search_string}%` } },
      { product_type: { [Op.like]: `%${search_string}%` } },
      { body_html: { [Op.like]: `%${search_string}%` } },
      { status: { [Op.like]: `%${search_string}%` } },
      { vendor: { [Op.like]: `%${search_string}%` } },
      { title: { [Op.like]: `%${search_string}%` } },
    ],
    
        created_at: {
       [Op.between]: [startedDate, endDate]
   }
  
  },
  limit: 10,
      offset: page,
    include: [{
        model: ProductVariant
    }]
  })
}else{
  result = await Product.findAndCountAll({
    where: {store_id : {
      [Op.in]: store_id  
    },  [Op.or]: [
      { id: { [Op.like]: `%${search_string}%` } },
      { product_type: { [Op.like]: `%${search_string}%` } },
      { body_html: { [Op.like]: `%${search_string}%` } },
      { status: { [Op.like]: `%${search_string}%` } },
      { vendor: { [Op.like]: `%${search_string}%` } },
      { title: { [Op.like]: `%${search_string}%` } },
    ],
    
  },
  limit: 10,
      offset: page,
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



exports.deleteProductShopify = async (req,res) =>{
  
  try {
    const id = req.params.store_id;
    Integration.findOne({ where: { store_id: id } })
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
        }else{
          res.status(401).send({
            message : "Store Not Found."
          });  
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
  

  try {
    const id = req.params.store_id;
    Integration.findOne({ where: { store_id: id } })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
          
                  
          product =  await shopify.product.create(req.body.shopify);
                     
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
            variants = product.variants;
            
            variants.forEach(async product_variant => {
                guid = uuidv4();
                guid_variation = guid.replace(/-/g,"");
                product_variant_data = {
                        guid : guid_variation,
                        store_id : store_id,
                        product_id : product_variant.product_id,
                        barcode :product_variant.barcode,
                        compare_at_price : product_variant.compare_at_price,
                        created_at : product_variant.created_at,
                        fulfillment_service : product_variant.fulfillment_service,
                        grams : product_variant.grams,
                        weight : product_variant.weight,
                        weight_unit : product_variant.weight_unit,
                        id : product_variant.id,
                        inventory_item_id : product_variant.inventory_item_id,
                        inventory_management : product_variant.inventory_management,
                        inventory_policy : product_variant.inventory_policy,
                        inventory_quantity : product_variant.inventory_quantity,
                        option1 : product_variant.option1,
                        option2 :  product_variant.option2,
                        option3 :  product_variant.option3,
                        position : product_variant.position,
                        price : product_variant.price,
                        presentment_prices : "",
                        shopify_product_id : product_variant.product_id,
                        requires_shipping : product_variant.requires_shipping,
                        sku : product_variant.sku,
                        taxable : product_variant.taxable,
                        title : product_variant.title,
                        image_id : product_variant.image_id
                }
            
                await   ProductVariant.create(product_variant_data);

              });
          return res.json({message : "Product Created Successfully."});
        }else{
          res.status(401).send({
            message : "Store Not Found."
          });  
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




exports.updateProductShopify = async (req,res) =>{
  
  
  try {
    const id = req.params.store_id;
    Integration.findOne({ where: { store_id: id } })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
          
                  
          product =  await shopify.product.update(req.params.product_id,req.body.shopify);
                     
          const store_id = data.store_id;
            // guid = uuidv4();
            // guid_product = guid.replace(/-/g,"");
            product_content = {
            
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
          
            
            await   Product.update(product_content,{where: { id: product.id }});
            variants = product.variants;
            
            variants.forEach(async product_variant => {
                // guid = uuidv4();
                // guid_variation = guid.replace(/-/g,"");
                product_variant_data = {
                                                
                        barcode :product_variant.barcode,
                        compare_at_price : product_variant.compare_at_price,
                        created_at : product_variant.created_at,
                        fulfillment_service : product_variant.fulfillment_service,
                        grams : product_variant.grams,
                        weight : product_variant.weight,
                        weight_unit : product_variant.weight_unit,
                        id : product_variant.id,
                        inventory_item_id : product_variant.inventory_item_id,
                        inventory_management : product_variant.inventory_management,
                        inventory_policy : product_variant.inventory_policy,
                        inventory_quantity : product_variant.inventory_quantity,
                        option1 : product_variant.option1,
                        option2 :  product_variant.option2,
                        option3 :  product_variant.option3,
                        position : product_variant.position,
                        price : product_variant.price,
                        presentment_prices : "",
                        shopify_product_id : product_variant.product_id,
                        requires_shipping : product_variant.requires_shipping,
                        sku : product_variant.sku,
                        taxable : product_variant.taxable,
                        title : product_variant.title,
                        image_id : product_variant.image_id
                }
            
                
                await   ProductVariant.update(product_variant_data,{where: { product_id: product_variant.product_id }});
              });
          return res.json({message : "Product Updated Successfully."});
        }else{
          res.status(401).send({
            message : "Store Not Found."
          });  
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

