const Shopify = require('shopify-api-node');
const User = require("../../models/user");
const Catalog = require("../../models/catalog");
const {validationResult} = require("express-validator");
const VendorProduct = require("../../models/vendorProducts");
const VendorProductVariant = require("../../models/vendorProductVariants");
var pluck = require('arr-pluck');
const Integration = require("../../models/integration");
const Product = require("../../models/products");
const ProductVariant = require("../../models/product_variants");
const UserVendorProduct = require("../../models/userVendorProduct");

exports.getSuppliersCatalog =  async (req,res) =>{
    


    user_id = await User.find({access_group :'supplier',deleted_at:null}).select('_id');
    user_id = pluck(user_id, '_id');
    product_id = await Catalog.find({ user_id: { $in: user_id }});
    product_id = pluck(product_id, 'product_id');
    data_product_id = [];
 Promise.all(product_id.map(async (data) => {
  
  data_product_id = data_product_id.concat(data); 
}))

    const page = req.body.page!=null ? req.body.page : 1;
const options = {
  page: page,
  limit: 10,
  populate: 'user_id',
  collation: {
    locale: 'en',
  },
};
result = await VendorProduct.paginate({ id: { $in: data_product_id } 
}, options, function (err, result) {
  return res.json(result);
});

  }    


exports.addProduct =  async (req,res) =>{
  const id = req.params.id;
  
  result = await VendorProduct.aggregate([
    { $match : { id : id } },
    { 
      $lookup:
       {
         from: 'vendorproductvariants',
         localField: 'id',
         foreignField: 'product_id',
         as: 'variant'
       }
     }
    ])
    
    if(result.length > 0){
      result = result[0];
      supplier_id = result.user_id;
      shopify_product = {
        title : result.title,
        body_html: result.body_html,
        vendor: result.vendor,
        product_type: result.product_type,
      }

      if(result.variant!=null){
        variant = result.variant;
        variant_data =[];
        key=1;
        Promise.all(variant.map(async (data) => {
          key++;
          variant={
            "option1" : data.option1,
            "sku": data.sku,
            "price" : data.price
          }
          variant_data.push(variant);
        }))
        shopify_product.variants = variant_data;  
      }

      if(result.images!=null){
        images = result.images;
        images_data =[];
        key=1;
        Promise.all(images.map(async (data) => {
          key++;
          image={
            "src" : data,
          }
          images_data.push(image);
        }))
        shopify_product.images = images_data;  
      }
      
    p = await Product.findOne({supplier_product_id : req.params.id, user_id: req.user._id});  
    if(p!=null){
      return res.status(400).send({
        message : "Product is already added to store."
      });
    }  
    
    Integration.findOne({  store_id: req.params.store_id  })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
          
                  
          product =  await shopify.product.create(shopify_product);
                     
          const store_id = data.store_id;
          const integration_id = data._id;

            product_content = {
              supplier_product_id : id,
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
                status:product.status,
                supplier_id : supplier_id,
                user_id : req.user._id 
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
                        image_id : product_variant.image_id,
                        supplier_id :supplier_id
                }
            
                await   ProductVariant.create(product_variant_data);

              });
              user_vendor_product_data = {
                user_id : req.user._id,
                supplier_id : supplier_id,
                supplier_product_id : id,
                product_id : product.id,
                store_id : store_id,
                integration_id : integration_id
              }
              await   UserVendorProduct.create(user_vendor_product_data);
          return res.json({message : "Product Created Successfully."});
        }else{
          res.status(401).send({
            message : "Store Not Found."
          });  
        }

      }).catch(err => {
        res.status(500).send({
          message: "Something Went Wrong",
          err_m : err
        });
      }); 







    }else{
      res.status(401).send({
        message : "Product Not Found."
      });  
    }


  }    

  exports.productSingleVendor =  async (req,res) =>{
    user_id =  req.params.user_id;
   


   
   
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

  
 
   await VendorProduct.paginate({ user_id:  user_id ,
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
  result = await VendorProduct.paginate({ user_id:  user_id ,
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