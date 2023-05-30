const Shopify = require('shopify-api-node');
require('dotenv').config();
const Customer = require("../../models/customer");
const Integration = require("../../models/integration");

var pluck = require('arr-pluck');
const {validationResult} = require("express-validator");

exports.syncCustomer = async (req,res) =>{
  page_info = req.body.page_info;
  const id = req.params.integration_id;

  integration_data = await Integration.find();
  Promise.all(integration_data.map(async (integration_element) => { 
      try{
        const shopify = new Shopify({
          shopName: integration_element.domain,
          accessToken: integration_element.access_token
        });
        
          const store_id = integration_element.store_id;

        
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
            
                    
         Customer.findOneAndUpdate(
          {store_id : store_id,shopify_id : element.id},
          {$set : customer_content},
          {upsert: true,new: true},
          (err,customer) => {})

          }));  
          shopify_id =  await Customer.find({store_id : store_id}).select('shopify_id');
          shopify_id = pluck(shopify_id, 'shopify_id');
         
         var difference = shopify_id.filter(x => customer_id.indexOf(x) === -1);
         await Customer.remove({shopify_id:{$in:difference}})
         
        }
        catch (error) { console.log(`Error Occur In Store ${integration_element.store_id} `) }
      
          

    
  }));  
  return res.json(
    {message:"Customer Synced Successfully"});
}
