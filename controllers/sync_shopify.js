const Shopify = require('shopify-api-node');
const db = require("../models");
const Integration = db.integration;
const Product = db.product;
const ProductCustomData = db.productCustomData;
const ProductVariant = db.productVariant;
const Customer = db.customer;

const Op = db.Sequelize.Op;
// const uuid = require("uuid/v1");
const { v4: uuidv4 } = require('uuid');
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
          
          try {
            const store_id = data.store_id;
          product_data = await shopify.product.list();
          product_data.forEach( async element => {                
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
            };
            variants = element.variants;
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
            
                const foundProductVariant = await ProductVariant.findOne({where : { product_id: product_variant.product_id }});
                
                if (!foundProductVariant) {
                  await   ProductVariant.create(product_variant_data);   
                 }else{
                  await   ProductVariant.update(product_variant_data,{where: { product_id: product_variant.product_id }});   
                 }
                  
                
            });
                        
                const foundProduct = await Product.findOne({where : { id: element.id }});
                if (!foundProduct) {
                     await   Product.create(product_content);   
                 }else{
                  await   Product.update(product_content,{where: { id: element.id  }});   
                 }
            
      });
      return res.json("Product Synced Successfully");
          } catch (error) {
            res.status(500).send({
              message: error
            });
          }
          
        } else {
          res.status(404).send({
            message: `Cannot connect shopify with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving shopify account with id=" + err
        });
      });
      
      
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
          

          try {                
            const store_id = data.store_id;
            customer_data = await shopify.customer.list();
            customer_data.forEach(async  element => {
              guid = uuidv4();
              guid = guid.replace(/-/g,"");
              customer_content = {
                guid : guid,
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
                company : element.default_address.company,
                address_line1 : element.default_address.address1,
                address_line2  : element.default_address.address2,
                city : element.default_address.city,
                province : element.default_address.province,
                country : element.default_address.country,
                zip : element.default_address.zip,
                phone : element.default_address.phone,
                province_code : element.default_address.province_code,
                country_code : element.default_address.country_code,
                country_name : element.default_address.country_name,
                default : element.default_address.default,
                    
              }

                const foundCustomer = await Customer.findOne({where : { shopify_id: element.id }});
                
                if (!foundCustomer) {
                  await   Customer.create(customer_content);   
                 }else{
                  await   Customer.update(customer_content,{where: { shopify_id: element.id }});   
                 } 
              
            });
            return res.json("Customer Synced Successfully");
          }catch (error) {
            res.status(500).send({
              message: error
            });
          }
        } else {
          res.status(404).send({
            message: `Cannot connect shopify with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving shopify account with id=" + id
        });
      });
      
      
  }