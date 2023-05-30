const Shopify = require('shopify-api-node');
const Order = require("../../models/order");
const Integration = require("../../models/integration");
const UserVendorProduct = require("../../models/userVendorProduct");    
const UserVendorOrder = require("../../models/userVendorOrder");
const OrderVendor = require("../../models/orderVendor");

exports.syncOrder = async (req,res) =>{
    
        integration_data = await Integration.find();
        Promise.all(integration_data.map(async (integration_element) => {
        
              const shopify = new Shopify({
                shopName: integration_element.domain,
                accessToken: integration_element.access_token
              });
              
        const store_id = integration_element.store_id;
        
        const integration_id = integration_element._id;
        order_data=[];
        let params = { limit: 250 };
        
        do {
          const orders = await shopify.order.list(params);
       Promise.all(orders.map(async (element) => {
            order_data.push(element);
          }))
          
          params = orders.nextPageParameters;
          
        } while (params !== undefined);
        

         Promise.all(order_data.map(async (element) => {
          product_ids = [];
          variant_ids = [];
          Promise.all(element.line_items.map(async (line_item) => {
              product_ids.push(line_item.product_id);
              variant_ids.push(line_item.variant_id);
          }));
        if(integration_element.role=='user'){
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
            line_items : element.line_items,
            variant_ids : JSON.stringify(variant_ids),
            product_ids: JSON.stringify(product_ids)
        }	
        


        

        Order.findOneAndUpdate(
          {store_id : store_id,shopify_order_id : element.id},
          {$set : order_content},
          {upsert: true,new: true},
          (err,order) => {})

        vendorOrder = await UserVendorProduct.findOne({product_id: { $in: product_ids }})
        if(vendorOrder!=null){
          vendorOrderData = {
            user_id : integration_element.user_id,
            supplier_id : vendorOrder.supplier_id,
            product_id : vendorOrder.product_id,
            shopify_order_id :  element.id, 
            integration_id : integration_id,
            store_id : store_id
          }

          UserVendorOrder.findOneAndUpdate(
            {user_id : integration_element.user_id,
              supplier_id : vendorOrder.supplier_id,
              product_id : vendorOrder.product_id,
              shopify_order_id :  element.id
            },
            {$set : order_content},
            {upsert: true,new: true},
            (err,order) => {})
         
        }          
        }

      }));
      
        }));  
        return res.json(
          {message:"Order Synced Successfully"});
}