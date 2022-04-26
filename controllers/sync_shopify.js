const Shopify = require('shopify-api-node');
const db = require("../models");
const Integration = db.integration;
const Product = db.product;
const ProductCustomData = db.productCustomData;
const ProductVariant = db.productVariant;
const Op = db.Sequelize.Op;
// const uuid = require("uuid/v1");
const { v4: uuidv4 } = require('uuid');
exports.syncProduct =  (req,res) =>{
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
          product_data = await shopify.product.list();
          product_data.forEach( async element => {                
            guid = uuidv4();
            guid_product = guid.replace(/-/g,"");
            product_content = {
                guid: guid_product,
                store_id : 0,
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
                        store_id : 0,
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
            
            
                  await   ProductVariant.findOrCreate(
                    {
                      where: { product_id: product_variant.product_id },
                      defaults: product_variant_data
                    });   
                
            });
            
            await   Product.findOrCreate(
                {
                  where: { id: element.id },
                  defaults: product_content
                }); 
            
            
            return res.json("Product Synced Successfully");
      });
          } catch (error) {
            console.error(error);
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