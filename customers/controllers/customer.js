const Shopify = require('shopify-api-node');
require('dotenv').config();
const Customer = require("../../models/customer");
const Integration = require("../../models/integration");
//const Product = require("../../models/product");
const { v4: uuidv4 } = require('uuid');
var pluck = require('arr-pluck');
const {validationResult} = require("express-validator");

exports.syncCustomer = (req,res) =>{
  page_info = req.body.page_info;
  const id = req.params.integration_id;
  console.log("id::",id);
  Integration.findOne({_id : id})
    .then( async data => {
      if (data) {
        const shopify = new Shopify({
          shopName: data.domain,
          accessToken: data.access_token
        });
        

        
          const store_id = data.store_id;
          const user_id = data.user_id;
      await Customer.deleteOne({ store_id : store_id });
        
        customer_data=[];
          let params = { limit: 250 };

          do {
            const customers = await shopify.customer.list(params);
             Promise.all(customers.map(async (element) => {
              customer_data.push(element);
            }))
            
            params = customers.nextPageParameters;
            
          } while (params !== undefined);
        
        
          customer_id = [];
        
           Promise.all(customer_data.map(async (element) => {
            customer_id.push(""+element.id+"");
            customer_content = {
              user : user_id,
              store_id : store_id,
              first_name : element.first_name,
              last_name : element.last_name,
              created_at : element.created_at,
              updated_at : element.updated_at,
              accepts_marketing : element.accepts_marketing,
              email : element.email,
              orders_count : element.orders_count,
              total_spent : element.total_spent,
              tax_exempt : element.tax_exempt,
              shopify_id : element.id,
              company :  (typeof element.default_address !== 'undefined') ? element.default_address.company : '',
              address_line1 : (typeof element.default_address !== 'undefined') ? element.default_address.address_line1 : '',
              address_line2  : (typeof element.default_address !== 'undefined') ? element.default_address.address_line2 : '',
              city : (typeof element.default_address !== 'undefined') ? element.default_address.city : '',
              province : (typeof element.default_address !== 'undefined') ? element.default_address.province : '',
              country : (typeof element.default_address !== 'undefined') ? element.default_address.country : '',
              zip : (typeof element.default_address !== 'undefined') ? element.default_address.zip : '',
              phone : (typeof element.default_address !== 'undefined') ? element.default_address.phone : '',
              province_code : (typeof element.default_address !== 'undefined') ? element.default_address.province_code : '',
              country_code : (typeof element.default_address !== 'undefined') ? element.default_address.country_code : '',
              country_name : (typeof element.default_address !== 'undefined') ? element.default_address.country_name : '',
              default : (typeof element.default_address !== 'undefined') ? element.default_address.default : null,
              state :  element.state       
            }
            
         Customer.create(customer_content);              
        //  Customer.findOneAndUpdate(
        //   {store_id : store_id,shopify_id : element.id},
        //   {$set : customer_content},
        //   {upsert: true,new: true},
        //   (err,customer) => {})

          }));  
        //   shopify_id =  await Customer.find({store_id : store_id}).select('shopify_id');
        //   shopify_id = pluck(shopify_id, 'shopify_id');
         
        //  var difference = shopify_id.filter(x => customer_id.indexOf(x) === -1);
        //  await Customer.deleteOne({shopify_id:{$in:difference}})

          return res.json(
            {message:"Customer Synced Successfully"});

      } else {
        res.status(404).send({
          message: `Cannot connect shopify with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Something Went Wrong",
        error : err
      });
    });
    
    
}

exports.getSingleCustomer = async (req,res) =>{
  const id = req.params.customer_id;
  result = await Customer.findOne({_id : id,user : req.user._id})
  return res.json({data:result});
}






exports.getCustomerAccordingtoStore = async (req,res) =>{
  
  store_id =req.body.store_id!=null ? req.body.store_id : [];
  if(store_id==0){
    store_id = await Integration.find({user_id :req.user._id,deleted_at:null}).select('store_id');
    store_id = pluck(store_id, 'store_id');
  }

  const search_string = req.body.search_string!=null ? req.body.search_string : "";
  const page = req.body.page!=null ? 1 : 0;
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
    result = await Customer.paginate({ store_id: { $in: store_id } ,
      created_at: {
        $gte: startedDate,
        $lte: endDate
    },
      $or:[
            {'store_id': { $regex: '.*' + `${search_string}` + '.*' }},
            {'first_name': { $regex: '.*' + `${search_string}` + '.*' }},
            {'last_name': { $regex: '.*' + `${search_string}` + '.*' }},
            {'shopify_id': { $regex: '.*' + `${search_string}` + '.*' }},
            {'email': { $regex: '.*' + `${search_string}` + '.*' }},
            {'address_line1': { $regex: '.*' + `${search_string}` + '.*' }},
            {'address_line2': { $regex: '.*' + `${search_string}` + '.*' }},
            {'city': { $regex: '.*' + `${search_string}` + '.*' }},
            {'province': { $regex: '.*' + `${search_string}` + '.*' }},
            {'country': { $regex: '.*' + `${search_string}` + '.*' }},
            {'zip': { $regex: '.*' + `${search_string}` + '.*' }},
            {'phone': { $regex: '.*' + `${search_string}` + '.*' }}
          ]
    }, options, function (err, result) {
      return res.json(result);
    });
  }else{
    result = await Customer.paginate({ store_id: { $in: store_id } ,
      $or:[
            {'store_id': { $regex: '.*' + `${search_string}` + '.*' }},
            {'first_name': { $regex: '.*' + `${search_string}` + '.*' }},
            {'last_name': { $regex: '.*' + `${search_string}` + '.*' }},
            {'shopify_id': { $regex: '.*' + `${search_string}` + '.*' }},
            {'email': { $regex: '.*' + `${search_string}` + '.*' }},
            {'address_line1': { $regex: '.*' + `${search_string}` + '.*' }},
            {'address_line2': { $regex: '.*' + `${search_string}` + '.*' }},
            {'city': { $regex: '.*' + `${search_string}` + '.*' }},
            {'province': { $regex: '.*' + `${search_string}` + '.*' }},
            {'country': { $regex: '.*' + `${search_string}` + '.*' }},
            {'zip': { $regex: '.*' + `${search_string}` + '.*' }},
            {'phone': { $regex: '.*' + `${search_string}` + '.*' }}
          ]
    }, options, function (err, result) {
      return res.json(result);
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
    const id = req.params.store_id;
    Integration.findOne({  store_id: id  })
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
          
              customer_content = {
                user : req.user._id,
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
  }
  catch (err) {
    return res.status(401).send({
      message : "Something Went Wrong",
      error :err
    });
  }
}

exports.deleteCustomerShopify = async (req,res) =>{
  
  
    const id = req.params.store_id;
    Integration.findOne({  store_id: id  })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
            await shopify.customer.delete(req.params.customer_id);
           await Customer.deleteOne({ shopify_id : req.params.customer_id })

          return res.json({message : "Customer Deleted Successfully."});
        }else{
          res.status(401).send({
            message : "Store Not Found."
          });  
        }

      }).catch(err => {
        res.status(500).send({
          message: "Something Went Wrong",
          error : err
        });
      });  
  
}

exports.updateCustomerShopify = async (req,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }
  
  try {
    const id = req.params.store_id;
    Integration.findOne({  store_id: id  })
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
                phone : customer.phone,
                province_code : customer.default_address.province_code,
                country_code : customer.default_address.country_code,
                country_name : customer.default_address.country_name,
                default : customer.default_address.default,
                state :  customer.state       
              }

              await Customer.findOneAndUpdate(
                {shopify_id: customer.id},
                {$set : customer_content},
                {new: true},
                (err,customer) => {}
                )
           return res.json({message : "Customer Updated Successfully."});
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




exports.checkCustomerEmailExist = async (req,res) =>{
  

  await Customer.findOne({store_id: req.params.store_id,email:req.body.email })
  .then(  data => {
    if (data) {
      return res.json({"message":'Email Exist'});
    }
    return res.json({"message":'Not Exist'});
  }).catch(err => {
    res.status(500).send({
      message: "Something Went Wrong",
      err_m : err
    });
  });

}  



exports.checkCustomerPhoneExist =  (req,res) =>{
  Customer.findOne({  store_id: req.params.store_id,phone:req.body.phone  }).then(  data => {
    if (data) {
      return res.json({"message":'Phone Exist'});
    }
    return res.json({"message":'Not Exist'});
  }).catch(err => {
    res.status(500).send({
      message: "Something Went Wrong",
      err_m : err
    });
  });
}  

