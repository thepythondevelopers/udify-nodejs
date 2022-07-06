const Shopify = require('shopify-api-node');
const db = require("../models");
const Integration = db.integration;
const Product = db.product;
const ProductCustomData = db.productCustomData;
const ProductVariant = db.productVariant;
const Customer = db.customer;
const Order = db.order;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');

exports.syncOrder =  (req,res) =>{
  //page_info = req.body.page_info;
  const id = req.params.integration_id;
  Integration.findByPk(id)
    .then( async data => {
      if (data) {
        const shopify = new Shopify({
          shopName: data.domain,
          accessToken: data.access_token
        });
          

        //order_data = await shopify.order.list();
        const store_id = data.store_id;
        
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
        
        Order.destroy({
          where: {
              store_id : store_id
          }
      })
        await Promise.all(order_data.map(async (element) => {
          product_ids = [];
          variant_ids = [];
          Promise.all(element.line_items.map(async (line_item) => {
              product_ids.push(line_item.product_id);
              variant_ids.push(line_item.variant_id);
          }));
          guid = uuidv4();
            guid = guid.replace(/-/g,"");
            
          order_content = {
              guid : guid,
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
              customer_id : element.customer.id,
              variant_ids : JSON.stringify(variant_ids),
              product_ids: JSON.stringify(product_ids)
          }	


          Order.create(order_content);

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

exports.syncProduct =  (req,res) =>{
    //page_info = req.body.page_info;
    const id = req.params.integration_id;
    Integration.findByPk(id)
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
          
            const store_id = data.store_id;

            
            

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
          await Product.destroy({
            where: {store_id : store_id}
          })
          await ProductVariant.destroy({
            where: {store_id : store_id}
          })  
          //product_data.forEach( async element => {                
          await Promise.all(product_data.map(async (element) => {  
            guid = uuidv4();
            guid_product = guid.replace(/-/g,"");
            product_content = {
                guid: guid_product,
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
                status:element.status
            };
            await   Product.create(product_content);
            await shopify_sync_variants(element.variants,store_id);
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

            }));
  }

  exports.syncCustomer = (req,res) =>{
    page_info = req.body.page_info;
    const id = req.params.integration_id;
    Integration.findByPk(id)
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          

          
            const store_id = data.store_id;
            Customer.destroy({
              where: {
                  store_id : store_id
              }
          })
          
          customer_data=[];
            let params = { limit: 250 };

            do {
              const customers = await shopify.customer.list(params);
              await Promise.all(customers.map(async (element) => {
                customer_data.push(element);
              }))
              
              params = customers.nextPageParameters;
              
            } while (params !== undefined);
          
          
            
          
            await Promise.all(customer_data.map(async (element) => {
                  
              guid = uuidv4();
              guid = guid.replace(/-/g,"");
              customer_content = {
                guid:guid,
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
        
           await Customer.create(customer_content);              
          
            }));  
            
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
          message: "Error retrieving shopify account with id=" + id,
          error : err
        });
      });
      
      
  }