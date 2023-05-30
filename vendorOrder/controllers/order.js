const Order = require("../../models/order");
const Integration = require("../../models/integration");
const UserVendorProduct = require("../../models/userVendorProduct");    
const UserVendorOrder = require("../../models/userVendorOrder");
const OrderVendor = require("../../models/orderVendor");
const Shopify = require('shopify-api-node');
var pluck = require('arr-pluck');
const moment= require('moment');

exports.getUserOrder =  async (req,res) =>{
    
  shopify_order_id = await UserVendorOrder.find({supplier_id : req.user._id}).select('shopify_order_id');
  shopify_order_id = pluck(shopify_order_id, 'shopify_order_id');
  //return res.json(req.user._id);
  const search_string = req.body.search_string!=null ? req.body.search_string : "";
  const page = req.body.page!=null ? req.body.page : 1;
  const options = {
    page: page,
    limit: 10,
    collation: {
      locale: 'en',
    },
  };
  
  limit = 10;
  skip = (page-1)*10;

 
    if(req.body.startedDate!=null && req.body.endDate!=null ){
    
      const startedDate = new Date(req.body.startedDate);
      const endDate = new Date(req.body.endDate);
      endDate.setDate(endDate.getDate() + 1);

      data = await  Order.aggregate([
        { 
          $match:{
          'shopify_order_id' : { $in: shopify_order_id },
          $or:[
             {'name': { $regex: '.*' + `${search_string}` + '.*' }},
             {'total': { $regex: '.*' + `${search_string}` + '.*' }},
             {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
          ],
          created_at: {
            $gte: startedDate,
            $lte: endDate
        }
        }
      },
        { 
          $lookup:
           {
             from: 'uservendororders',
             localField: 'shopify_order_id',
             foreignField: 'shopify_order_id',
             as: 'vendor_order_details'
           }
         },
         {
          $lookup: {
              from: 'users',
              let: { vendor_order_details: '$vendor_order_details' },
              pipeline: [
                  { $match: { '$expr': { '$in': ['$_id', '$$vendor_order_details.user_id'] } } },
                  
              ],
              as: 'user_details',
          }
      },
      {
        $facet: {
          metadata: [ { $count: 'total' },{ $addFields: { page: page } } ],
          data: [ { $skip: skip }, { $limit: limit } ]
      }
      }
        ])
    }else{
      data = await  Order.aggregate([
        { 
          $match:{
          'shopify_order_id' : { $in: shopify_order_id },
          $or:[
             {'name': { $regex: '.*' + `${search_string}` + '.*' }},
             {'total': { $regex: '.*' + `${search_string}` + '.*' }},
             {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
          ]
        }
      },
      
        { 
          $lookup:
           {
             from: 'uservendororders',
             localField: 'shopify_order_id',
             foreignField: 'shopify_order_id',
             as: 'vendor_order_details'
           }
         },
         {
          $lookup: {
              from: 'users',
              let: { vendor_order_details: '$vendor_order_details' },
              pipeline: [
                  { $match: { '$expr': { '$in': ['$_id', '$$vendor_order_details.user_id'] } } },
                 
              ],
              as: 'user_details',
          }
      },
      {
        $facet: {
          metadata: [ { $count: 'total' },{ $addFields: { page: page } } ],
          data: [ { $skip: skip }, { $limit: limit } ]
      }
      }
        ])
    }    
  return res.json(data);
    
  }    

exports.syncOrder =  (req,res) =>{
  
  const id = req.params.integration_id;
  Integration.findOne({_id : id})
    .then( async data => {
      if (data) {
        const shopify = new Shopify({
          shopName: data.domain,
          accessToken: data.access_token
        });
          

  
        const store_id = data.store_id;
        const integration_id = data._id;
        order_data=[];
        let params = { limit: 250 };
  
        do {
          const orders = await shopify.order.list(params);
          await Promise.all(orders.map(async (element) => {
            order_data.push(element);
          }))
          
          params = orders.nextPageParameters;
          
        } while (params !== undefined);
        
        await OrderVendor.remove({ store_id : store_id })
        await Promise.all(order_data.map(async (element) => {
          product_ids = [];
          variant_ids = [];
          Promise.all(element.line_items.map(async (line_item) => {
              product_ids.push(line_item.product_id);
              variant_ids.push(line_item.variant_id);
          }));
          
          order_content = {
          
              store_id : store_id,
              created_at : element.created_at,
              updated_at : element.updated_at,
              subtotal : element.subtotal_price,
              total : element.total_price,
              closed_at : element.closed_at,
              shopify_order_id : element.id,
              note : element.note,
              token :element.token,
              gateway : element.gateway,
              total_weight : element.total_weight,
              total_tax : element.total_tax,
              taxes_included : element.taxes_included,
              currency : element.currency,
              financial_status : element.financial_status,
              confirmed : element.confirmed,
              total_discounts : element.total_discounts,
              total_line_items_price : element.total_line_items_price,
              cart_token : element.cart_token,
              name : element.name,
              cancelled_at : element.cancelled_at,
              cancel_reason : element.cancel_reason,
              total_price_usd : element.total_price_usd,
              checkout_token : element.checkout_token,
              processed_at : element.processed_at,
              device_id : element.device_id,
              app_id : element.app_id,
              browser_ip : element.browser_ip,
              fulfillment_status : element.fulfillment_status,
              order_status_url : element.order_status_url,
              customer_id : element.customer!=null ? element.customer.id : '',
              variant_ids : JSON.stringify(variant_ids),
              product_ids: JSON.stringify(product_ids)
          } 
          

          OrderVendor.create(order_content);
          
      }));
      return res.json(
          {message:"Order Synced Successfully"});
      }else{
        res.status(401).send({
          message : "Store Not Found."
        });
      }
  }) .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Syncing."
      });
    });   
} 

// exports.getOrderAccordingtoStore = async (req,res) =>{
  
      
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
  

//   result = await OrderVendor.paginate({ store_id: { $in: store_id } ,
//     created_at: {
//       $gte: startedDate,
//       $lte: endDate
//   },
//     $or:[
//           {'name': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'total': { $regex: '.*' + `${search_string}` + '.*' }},
//           {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
//         ]
//   }, options, function (err, result) {
//     return res.json(result);
//   });
// }else{
//   result = await OrderVendor.paginate({ store_id: { $in: store_id } ,
//           $or:[
//       {'name': { $regex: '.*' + `${search_string}` + '.*' }},
//       {'total': { $regex: '.*' + `${search_string}` + '.*' }},
//       {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
//       ]
//   }, options, function (err, result) {
//     return res.json(result);
//   });
// } 
// }

exports.getSingleOrder = async (req,res) =>{
  const id = req.params.order_id;
  result = await OrderVendor.findOne({_id : id});
  return res.json({data:result});
}