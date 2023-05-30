const Shopify = require('shopify-api-node');
require('dotenv').config();
const Integration = require("../../models/integration");
const Product = require("../../models/products");
const ProductVariant = require("../../models/product_variants");
var pluck = require('arr-pluck');
const moment= require('moment');
const {validationResult} = require("express-validator");

//const { json } = require('body-parser');



exports.getSingleProduct = async (req,res) =>{
  const id = req.params.product_id;
  result = await Product.aggregate([
    { $match : { id : id } },
    { 
      $lookup:
       {
         from: 'productvariants',
         localField: 'id',
         foreignField: 'product_id',
         as: 'variant'
       }
     }
    ])
  return res.json({data:result});
}


exports.getProductAccordingtoStore = async (req,res) =>{
   
  store_id =req.body.store_id!=null ? req.body.store_id : [];
  if(store_id==0){
    store_id = await Integration.find({user_id :req.user._id,deleted_at:null}).select('store_id');
    store_id = pluck(store_id, 'store_id');
  }
   


   
   
const search_string = req.body.search_string!=null ? req.body.search_string : "";
const page = req.body.page!=null ? req.body.page : 1;
const options = {
  select : 'id images title product_type price vendor store_id _id',  
  page: page,
  limit: 10,
  collation: {
    locale: 'en',
  },
};
if(req.body.startedDate!=null && req.body.endDate!=null ){
  
  const startedDate = new Date(req.body.startedDate);
  const endDate = new Date(req.body.endDate);
  endDate.setDate(endDate.getDate() + 1);

  
 
   await Product.paginate({ store_id: { $in: store_id } ,
    published_at: {
      $gte: startedDate,
      $lte: endDate
  },
    $or:[
          {'id': { $regex: '.*' + `${search_string}` + '.*' }},
          {'product_type': { $regex: '.*' + `${search_string}` + '.*' }},
          {'body_html': { $regex: '.*' + `${search_string}` + '.*' }},

          {'status': { $regex: '.*' + `${search_string}` + '.*' }},
          {'vendor': { $regex: '.*' + `${search_string}` + '.*' }},
          {'title': { $regex: '.*' + `${search_string}` + '.*' }},
        ]
  }, options, function (err, result) {
    return res.json(result);
  });
}else{
  result = await Product.paginate({ store_id: { $in: store_id } ,
    $or:[
          {'id': { $regex: '.*' + `${search_string}` + '.*' }},
          {'product_type': { $regex: '.*' + `${search_string}` + '.*' }},
          {'body_html': { $regex: '.*' + `${search_string}` + '.*' }},

          {'status': { $regex: '.*' + `${search_string}` + '.*' }},
          {'vendor': { $regex: '.*' + `${search_string}` + '.*' }},
          {'title': { $regex: '.*' + `${search_string}` + '.*' }},
        ]
  }, options, function (err, result) {
    return res.json(result);
  });
} 
 

}



exports.deleteProductShopify = async (req,res) =>{
  
  try {
    const id = req.params.store_id;
    Integration.findOne({  store_id: id  })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          product =  await shopify.product.delete(req.params.product_id);

          
          await Product.deleteOne(
            {id : req.params.product_id},
            (err,data) => {          } )
            await ProductVariant.deleteOne( {product_id:req.params.product_id } )

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
    Integration.findOne({  store_id: id  })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
               
          product =  await shopify.product.create(req.body.shopify);
                     
          const store_id = data.store_id;
            
            product_content = {
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
            
                product_variant_data = {
            
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
    Integration.findOne({  store_id: id  })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
          
                  
          product =  await shopify.product.update(req.params.product_id,req.body.shopify);
                     
          const store_id = data.store_id;
            
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
          
            
            
            await Product.findOneAndUpdate(
              {id: product.id},
              {$set : product_content},
              {new: true},
              (err,product) => {}
              )
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
            
                
                
                await ProductVariant.findOneAndUpdate(
                  { product_id: product_variant.product_id},
                  {$set : product_variant_data},
                  {new: true},
                  (err,productV) => {}
                  )
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

exports.syncProduct =  (req,res) =>{
    //page_info = req.body.page_info;
    const id = req.params.integration_id;
    console.log("req.user._id",req.user._id);
    Integration.findOne({_id : id,user_id : req.user._id})
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
          
            const store_id = data.store_id;
            const user_id = data.user_id;
            
            

          //product_data = await shopify.product.count();

           product_data=[];
          let params = { limit: 250 };
          // product_data =  await shopify.product.list(params);
          do {
            const products = await shopify.product.list(params);
            await Promise.all(products.map(async (element) => {
              product_data.push(element);
            }))
            
            params = products.nextPageParameters;
            
          } while (params !== undefined);
          
          await Product.deleteOne({ store_id : store_id });
          await ProductVariant.deleteOne({ store_id : store_id });
          //product_data.forEach( async element => {                
          await Promise.all(product_data.map(async (element) => {  
          
            product_content = {
          
                store_id : store_id,
                body_html:element.body_html,
                handle: "",
                id  : element.id,
                images : JSON.stringify(element.images),
                options:JSON.stringify(element.options),
                product_type:element.product_type,
                published_at : element.published_at,
                published_scope:element.published_scope,
                tags:element.tags,
                template_suffix:element.template_suffix,
                title:element.title,
                metafields_global_title_tag:"",
                metafields_global_description_tag:"",
                vendor:element.vendor,  
                status:element.status,
                user_id : user_id
            }
               Product.create(product_content);
             shopify_sync_variants(element.variants,store_id);
           // variants = element.variants;
            
      }));
      return res.json({message:"Product Synced Successfully"});
          
          
        } else {
          res.status(404).send({
            message: `Cannot connect shopify with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving shopify account with id=" + id,
          error : err
        });
      });
      
      
  }

  function shopify_sync_variants(variants,store_id) {
    //variants.forEach(async product_variant => {
             Promise.all(variants.map(async (product_variant) => {  
          
              product_variant_data = {
          
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
                   ProductVariant.create(product_variant_data);

            }));
  }


  exports.userVendorSyncProduct = async (req,res) =>{
   
    store_id =req.body.store_id!=null ? req.body.store_id : [];
    if(store_id==0){
      store_id = await Integration.find({account_id :req.body.account_id,deleted_at:null}).select('store_id');
      store_id = pluck(store_id, 'store_id');
    }
     
  
  
  const search_string = req.body.search_string!=null ? req.body.search_string : "";
  const page = req.body.page!=null ? req.body.page : 1;
  const options = {
    page: page,
    limit: 10,
    collation: {
      locale: 'en',
    },
  };
  if(req.body.startedDate!=null && req.body.endDate!=null ){
    
    const startedDate = new Date(req.body.startedDate);
    const endDate = new Date(req.body.endDate);
    endDate.setDate(endDate.getDate() + 1);
  
    
   
     await Product.paginate({  supplier_id: { $exists: true }  ,
      store_id: { $in: store_id },
      published_at: {
        $gte: startedDate,
        $lte: endDate
    },
      $or:[
            {'id': { $regex: '.*' + `${search_string}` + '.*' }},
            {'product_type': { $regex: '.*' + `${search_string}` + '.*' }},
            {'body_html': { $regex: '.*' + `${search_string}` + '.*' }},
  
            {'status': { $regex: '.*' + `${search_string}` + '.*' }},
            {'vendor': { $regex: '.*' + `${search_string}` + '.*' }},
            {'title': { $regex: '.*' + `${search_string}` + '.*' }},
          ]
    }, options, function (err, result) {
      return res.json(result);
    });
  }else{
    result = await Product.paginate({ supplier_id: { $exists: true }  ,
      store_id: { $in: store_id },
      $or:[
            {'id': { $regex: '.*' + `${search_string}` + '.*' }},
            {'product_type': { $regex: '.*' + `${search_string}` + '.*' }},
            {'body_html': { $regex: '.*' + `${search_string}` + '.*' }},
  
            {'status': { $regex: '.*' + `${search_string}` + '.*' }},
            {'vendor': { $regex: '.*' + `${search_string}` + '.*' }},
            {'title': { $regex: '.*' + `${search_string}` + '.*' }},
          ]
    }, options, function (err, result) {
      return res.json(result);
    });
  } 
   
  
  }
  