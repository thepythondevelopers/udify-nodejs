const Shopify = require('shopify-api-node');
require('dotenv').config();
const Integration = require("../../models/integration");
const VendorProduct = require("../../models/vendorProducts");
const VendorProductVariant = require("../../models/vendorProductVariants");
var pluck = require('arr-pluck');
const moment= require('moment');
const {validationResult} = require("express-validator");
const fs = require("fs");
const parse = require('csv-parse').parse
//const { json } = require('body-parser');
const { v4: uuidv4 } = require('uuid');


exports.getSingleProduct = async (req,res) =>{
  const id = req.params.product_id;
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
  return res.json({data:result});
}





// exports.getProductAccordingtoStore = async (req,res) =>{
   
//   store_id =req.body.store_id!=null ? req.body.store_id : [];
//   if(store_id==0){
//     store_id = await Integration.find({account_id :req.body.account_id,deleted_at:null}).select('store_id');
//     store_id = pluck(store_id, 'store_id');
//   }
   


   
   
// const search_string = req.body.search_string!=null ? req.body.search_string : "";
// const page = req.body.page!=null ? req.body.page : 1;
// const options = {
//   page: page,
//   limit: 10,
//   collation: {
//     locale: 'en',
//   },
// };
// if(req.body.startedDate!=null && req.body.endDate!=null ){
  
//   const startedDate = new Date(req.body.startedDate);
//   const endDate = new Date(req.body.endDate);
//   endDate.setDate(endDate.getDate() + 1);

  
 
//    await VendorProduct.paginate({ store_id: { $in: store_id } ,
//     published_at: {
//       $gte: startedDate,
//       $lte: endDate
//   },
//   source : 'Shopify',
//     $or:[
//           {'id': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'product_type': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'body_html': { $regex: '.*' + `${search_string}` + '.*' }},

//           {'status': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'vendor': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'title': { $regex: '.*' + `${search_string}` + '.*' }},
//         ]
//   }, options, function (err, result) {
//     return res.json(result);
//   });
// }else{
//   result = await VendorProduct.paginate({ store_id: { $in: store_id } ,
//     source : 'Shopify',
//     $or:[
//           {'id': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'product_type': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'body_html': { $regex: '.*' + `${search_string}` + '.*' }},

//           {'status': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'vendor': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'title': { $regex: '.*' + `${search_string}` + '.*' }},
//         ]
//   }, options, function (err, result) {
//     return res.json(result);
//   });
// } 
 

// }


exports.getProduct = async (req,res) =>{
      
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
  
     await VendorProduct.paginate({ user_id:req.user._id,createdAt: {
        $gte: startedDate,
        $lte: endDate
    },
    source : 'Manual',
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
    result = await VendorProduct.paginate({ user_id:req.user._id,
      source : 'Manual',
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




// exports.syncProduct =  (req,res) =>{
    
//     const id = req.params.integration_id;
//     Integration.findOne({_id : id})
//       .then( async data => {
//         if (data) {
//           const shopify = new Shopify({
//             shopName: data.domain,
//             accessToken: data.access_token
//           });
          
          
//             const store_id = data.store_id;
//             const integration_id = data._id;

//            product_data=[];
//           let params = { limit: 250 };

//           do {
//             const products = await shopify.product.list(params);
//             await Promise.all(products.map(async (element) => {
//               product_data.push(element);
//             }))
            
//             params = products.nextPageParameters;
            
//           } while (params !== undefined);
          
//           await VendorProduct.remove({ store_id : store_id });
//           await VendorProductVariant.remove({ store_id : store_id });
          
//           Promise.all(product_data.map(async (element) => {  
          
//             product_content = {
//               user_id : req.user._id,
//               integration_id : integration_id,
//                 store_id : store_id,
//                 body_html:element.body_html,
//                 handle: "",
//                 id  : element.id,
//                 images : JSON.stringify(element.images),
//                 options:JSON.stringify(element.options),
//                 product_type:element.product_type,
//                 published_at : element.published_at,
//                 published_scope:element.published_scope,
//                 tags:element.tags,
//                 template_suffix:element.template_suffix,
//                 title:element.title,
//                 metafields_global_title_tag:"",
//                 metafields_global_description_tag:"",
//                 vendor:element.vendor,  
//                 status:element.status
//             };
//              VendorProduct.create(product_content);
//            shopify_sync_variants(element.variants,store_id,integration_id,req.user._id);
//            // variants = element.variants;
            
                                    
            
//       }));
//       return res.json({message:"Product Synced Successfully"});
          
          
//         } else {
//           res.status(404).send({
//             message: `Cannot connect shopify with id=${id}.`
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).send({
//           message: "Error retrieving shopify account with id=" + id,
//           error : err
//         });
//       });
      
      
//   }

  // function shopify_sync_variants(variants,store_id,integration_id,user_id) {
  //   //variants.forEach(async product_variant => {
  //            Promise.all(variants.map(async (product_variant) => {  
          
  //             product_variant_data = {
  //               user_id : user_id,
  //               integration_id : integration_id,
  //                       store_id : store_id,
  //                       product_id : product_variant.product_id,
  //                       barcode :product_variant.barcode,
  //                       compare_at_price : product_variant.compare_at_price,
  //                       created_at : product_variant.created_at,
  //                       fulfillment_service : product_variant.fulfillment_service,
  //                       grams : product_variant.grams,
  //                       weight : product_variant.weight,
  //                       weight_unit : product_variant.weight_unit,
  //                       id : product_variant.id,
  //                       inventory_item_id : product_variant.inventory_item_id,
  //                       inventory_management : product_variant.inventory_management,
  //                       inventory_policy : product_variant.inventory_policy,
  //                       inventory_quantity : product_variant.inventory_quantity,
  //                       option1 : product_variant.option1,
  //                       option2 :  product_variant.option2,
  //                       option3 :  product_variant.option3,
  //                       position : product_variant.position,
  //                       price : product_variant.price,
  //                       presentment_prices : "",
  //                       shopify_product_id : product_variant.product_id,
  //                       requires_shipping : product_variant.requires_shipping,
  //                       sku : product_variant.sku,
  //                       taxable : product_variant.taxable,
  //                       title : product_variant.title,
  //                       image_id : product_variant.image_id
  //               }
  //               await   VendorProductVariant.create(product_variant_data);

  //           }));
  // }

  exports.csvProduct = async (req,res) =>{
    file = req.file;
    fs.createReadStream(file.path)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      var string = row[2];
      var image_array = string.split(",");
      id = uuidv4();
      id = id.replace(/-/g,"");
      product_content = {
        user_id : req.user._id,
          body_html:row[1],
          id  : id,
          images : image_array,
          product_type:row[3],
          title:row[0],
          vendor:row[4],  
          source : 'Manual'       
      };
      await = VendorProduct.create(product_content);
      str = row[5];
     if(str!=null){ 
      
      const json = '[' + str.replace(/}\n?{/g, '},{') + ']';
      
      JSON.parse(json).forEach(async  (obj) => {
         product_variant_data = {
          product_id : id,
          sku : obj.sku,
          price : obj.price,
          option1 : obj.option1,
          user_id : req.user._id
        }
        await   VendorProductVariant.create(product_variant_data);
      });
    } 
    })
    return res.json({message:"Product Uploaded Successfully"}); 
  }