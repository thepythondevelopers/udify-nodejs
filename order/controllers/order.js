const Shopify = require('shopify-api-node');
const Order = require("../../models/order");
const Integration = require("../../models/integration");
const UserVendorProduct = require("../../models/userVendorProduct");    
const OrderPayment = require("../../models/userOrderPayment");   
const UserVendorOrder = require("../../models/userVendorOrder");
const Product = require("../../models/products");
const ProductVariant = require("../../models/product_variants");
const OrderAssign = require("../../models/orderAssign");
const User = require("../../models/user");
var pluck = require('arr-pluck');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
exports.syncOrder =  (req,res) =>{
  //page_info = req.body.page_info;
  const id = req.params.integration_id;
  Integration.findOne({_id : id})
    .then( async data => {
      if (data) {
        const shopify = new Shopify({
          shopName: data.domain,
          accessToken: data.access_token
        });
          

        //order_data = await shopify.order.list();
        const store_id = data.store_id;
        const integration_id = data._id;
        order_data=[];
        let params = { limit: 250 };
        // product_data =  await shopify.product.list(params);
        do {
          const orders = await shopify.order.list(params);
          await Promise.all(orders.map(async (element) => {
            order_data.push(element);
          }))
          params = orders.nextPageParameters;
          
        } while (params !== undefined);
        
       await Order.remove({ store_id : store_id })
        await Promise.all(order_data.map(async (element) => {
          product_ids = [];
          variant_ids = [];
          Promise.all(element.line_items.map(async (line_item) => {
              product_ids.push(line_item.product_id);
              variant_ids.push(line_item.variant_id);
          }));
          
          order_content = {
              integration_id : integration_id,  
              user : req.user._id,
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
              line_items : element.line_items, 
              variant_ids : JSON.stringify(variant_ids),
              product_ids: JSON.stringify(product_ids)
          }	
          

          Order.create(order_content);
          
          vendorOrder = await UserVendorProduct.findOne({product_id: { $in: product_ids }})
          if(vendorOrder!=null){
            vendorOrderData = {
              user_id : req.user._id,
              supplier_id : vendorOrder.supplier_id,
              product_id : vendorOrder.product_id,
              shopify_order_id :  element.id, 
              integration_id : integration_id,
              store_id : store_id
            }
            uvendorOrder = await UserVendorOrder.findOne({user_id : req.user._id,
              supplier_id : vendorOrder.supplier_id,
              product_id : vendorOrder.product_id});
            if(uvendorOrder!=null){

            }else{
              UserVendorOrder.create(vendorOrderData);  
            }
            
          }
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

exports.getOrderAccordingtoStore = async (req,res) =>{
  
      
    store_id =req.body.store_id!=null ? req.body.store_id : [];
    if(store_id==0){
      store_id = await Integration.find({user_id :req.user._id,deleted_at:null}).select('store_id');
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
    

    result = await Order.paginate({ store_id: { $in: store_id } ,
      created_at: {
        $gte: startedDate,
        $lte: endDate
    },
      $or:[
            {'name': { $regex: '.*' + `${search_string}` + '.*' }},
            {'total': { $regex: '.*' + `${search_string}` + '.*' }},
            {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
          ]
    }, options, function (err, result) {
      return res.json(result);
    });
  }else{
    result = await Order.paginate({ store_id: { $in: store_id } ,
            $or:[
        {'name': { $regex: '.*' + `${search_string}` + '.*' }},
        {'total': { $regex: '.*' + `${search_string}` + '.*' }},
        {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
        ]
    }, options, function (err, result) {
      return res.json(result);
    });
  } 
}

  exports.getSingleOrder = async (req,res) =>{
    const id = req.params.order_id;
    result = await Order.findOne({_id : id,user : ObjectId(req.user._id)});
    return res.json({data:result});
  }

  exports.orderProductSupplierInfo = async (req,res) =>{
  
    product_id = req.params.product_id;
    data = await UserVendorProduct.findOne({product_id:  product_id }).populate('supplier_id');
    product = await Product.aggregate([
      { $match : { id : product_id } },
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
    return res.json({vendor : data,product: product});
  }

exports.orderSupplierId = async (req,res)=>{
  order_supplier_id = await UserVendorOrder.find({shopify_order_id: req.body.shopify_order_id}).select('supplier_id'); 
    console.log("order supplier id::",order_supplier_id)
    return res.json(order_supplier_id);
}

exports.orderSupplierName = async (req,res)=>{
  order_supplier_fname = await User.findOne({_id: req.body.supplier_id}).select('first_name'); 
  order_supplier_lname = await User.findOne({_id: req.body.supplier_id}).select('last_name'); 
    //console.log("order supplier name ::",order_supplier_fname.first_name," ",order_supplier_lname.last_name);
    order_supplier_name={"supplier_name":order_supplier_fname.first_name+" "+order_supplier_lname.last_name}
    return res.json(order_supplier_name);
}

exports.orderCustomerId = async (req,res)=>{
  order_customer_id = await UserVendorOrder.find({shopify_order_id: req.body.shopify_order_id}).select('user_id'); 
    console.log("order customer id::",order_customer_id);
    return res.json(order_customer_id);
}
//6310db0c5febfa16ff2c86aa(p)
//
exports.orderCustomerNameEmail = async (req,res)=>{
  let order_customer_fname = '';
  let order_customer_lname = '';
  console.log("order customer id::",req.body.customer_id);
  order_customer_fname = await User.findOne({"_id": req.body.customer_id}).select(); 
  order_customer_lname = await User.findOne({"_id": req.body.customer_id}).select('last_name'); 
    console.log("order customer name ::",order_customer_fname,"order customer id::",req.body.customer_id);
    //console.log("order customer name ::",order_customer_fname.first_name +" "+order_customer_fname.last_name+" "+req.body.customer_id);
    if(order_customer_fname && order_customer_lname){
      order_customer_name={"customer_name":order_customer_fname.first_name+" "+order_customer_lname.last_name,"email":order_customer_fname.email};
      return res.json(order_customer_name);
    }
    else{
      return res.status(400).json({"error":"No such customer found"});
    }
}
exports.catalogUserOrderpayment = async (req,res) => {
  await OrderPayment.findOne({"shopify_order_id":req.body.shopify_order_id,"customer_id":req.body.customer_id},(err,doc)=>{
    //if(err) res.status(200).json({"msg":"Some sort of error occured"});
      //res.status(200).json({"msg":"Payment status updated Successfully"});
    if(err) return res.status(400).json({"msg":err});
    OrderPayment.findOne({"shopify_order_id":req.body.shopify_order_id,"customer_id":req.body.customer_id},(err2,doc2)=>{
      if(err) return res.status(400).json({"msg":err2});;
      if(doc2){
        return res.status(200).json({"status":doc2.status});
      }
      else{
        OrderPayment.create({"shopify_order_id":req.body.shopify_order_id,"status":"Unpaid","customer_id":req.body.customer_id},(err3,doc3)=>{
          if(err3) return res.status(400).json({"msg":err3});
          return res.status(200).json({"status":"Unpaid"});
        });
      }
    })
  });
}

exports.updateOrderPayment = async(req,res) => {
  var update_order_payment = await OrderPayment.find(
    {shopify_order_id : req.body.shopify_order_id},
    {customer_id : req.body.customer_id}
  );
  if(update_order_payment.length){
    console.log("update_order_payment",update_order_payment);
    var update_order_payment_status = OrderPayment.updateMany({shopify_order_id: req.body.shopify_order_id,customer_id : req.body.customer_id}, {$set:{status: "Paid"}},
    (err,doc)=>{
      if(err) res.status(200).json({"msg":"Some sort of error occured"});
      res.status(200).json({"msg":"Payment status updated Successfully"});
    }
    );
  }
  else{
    res.status(400).send({"msg":"No such data found"});
  }
  
}

exports.catalogUserOrderList = async (req,res) =>{
    shopify_order_id = await UserVendorOrder.find({user_id: req.user._id}).select('shopify_order_id'); 

    shopify_order_id = pluck(shopify_order_id, 'shopify_order_id');
    
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
    

    result = await Order.paginate({ shopify_order_id: { $in: shopify_order_id } ,
      created_at: {
        $gte: startedDate,
        $lte: endDate
    },
      $or:[
            {'name': { $regex: '.*' + `${search_string}` + '.*' }},
            {'total': { $regex: '.*' + `${search_string}` + '.*' }},
            {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
          ]
    }, options, function (err, result) {
      return res.json(result);
    });
  }else{
    result = await Order.paginate({ shopify_order_id: { $in: shopify_order_id } ,
            $or:[
        {'name': { $regex: '.*' + `${search_string}` + '.*' }},
        {'total': { $regex: '.*' + `${search_string}` + '.*' }},
        {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
        ]
    }, options, function (err, result) {
      console.log("response::",result)
      return res.json(result);
    });
  } 
  }  
  

  exports.orderassign = async (req,res) =>{
    order_id = req.params.order_id;
    vendor_id = req.params.vendor_id;


    orderCheck = UserVendorOrder.findOne({user_id: req.user._id,supplier_id: vendor_id,shopify_order_id:order_id,integration_id:req.body.integration_id,store_id:req.body.store_id})
    if(orderCheck!=null){
    order = await OrderAssign.findOne({
      order_id : order_id,
      product_id : req.body.product_id,
      assign_by : req.user._id,
      assign_to : vendor_id,
      store_id : req.body.store_id,
      integration_id : req.body.integration_id});
      if(order!=null){
        return res.status(401).json({
          message : "Already Assign."
        })
      }
   data = { 
    order_id : order_id,
    product_id : req.body.product_id,
    assign_by : req.user._id,
    assign_to : vendor_id,
    store_id : req.body.store_id,
    integration_id : req.body.integration_id
   }
    await OrderAssign.create(data);
    return res.json({
      message : "Order Assign Successfully."
    })
  }else{
    return res.status(401).json({
      message : "Order Does not Belong To Supplier."
    })
  }
  }  

  exports.orderPaymentAsk = async (req,res) =>{
    data ={
            payment_ask : 1
    }  

      await OrderAssign.findOneAndUpdate(
        { assign_to: req.user._id,_id : req.params.id},
        {$set : data},
        {new: true},
        (err,account) => {
            if(err){
                return res.status(404).json({
                    error : err
                })
            
            }
    
            if(account===null){
                return res.status(404).json({
                    message : "No Data Found"
                })
            }
    
            res.send({message:'Payment Request Generated.'});
        }
        )
  }

  exports.orderProductTrack = async (req,res) =>{
    data ={
            tracking_number : 1
    }  

      await OrderAssign.findOneAndUpdate(
        { assign_to: req.user._id,_id : req.params.id},
        {$set : data},
        {new: true},
        (err,account) => {
            if(err){
                return res.status(404).json({
                    error : err
                })
            
            }
    
            if(account===null){
                return res.status(404).json({
                    message : "No Data Found"
                })
            }
    
            res.send({message:'Payment Request Generated.'});
        }
        )
  }  