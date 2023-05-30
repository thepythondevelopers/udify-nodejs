const Shopify = require('shopify-api-node');


const Integration = require("../../models/integration");
const Product = require("../../models/products");
const ProductVariant = require("../../models/product_variants");
exports.productImageAdd =  (req,res) =>{
    
    const id = req.params.store_id;
    Integration.findOne({ store_id: id  })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
            await shopify.productImage.create(req.params.product_id, req.body.shopify_product_image);
            productImage = await shopify.productImage.list(req.params.product_id);
            await Product.findOneAndUpdate(
              { id: req.params.product_id},
              {$set : {images : JSON.stringify(productImage)}},
              {new: true},
              (err,product) => {}
              )
            productVariant = await shopify.productVariant.list(req.params.product_id);
            Promise.all(productVariant.map(async (element) => {
                
                await ProductVariant.findOneAndUpdate(
                  { id: element.id},
                  {$set : {image_id:element.image_id}},
                  {new: true},
                  (err,product) => {}
                  )
            }));
            
            
            return res.json(
              {message:"Image Created Successfully"});

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

exports.productImageDelete =  (req,res) =>{

        const id = req.params.store_id;
        Integration.findOne({ store_id: id  })
          .then( async data => {
            if (data) {
              const shopify = new Shopify({
                shopName: data.domain,
                accessToken: data.access_token
              });
              
                await shopify.productImage.delete(req.params.product_id, req.params.image_id);
                productImage = await shopify.productImage.list(req.params.product_id);
                await Product.findOneAndUpdate(
                  { id: req.params.product_id},
                  {$set : {images : JSON.stringify(productImage)}},
                  {new: true},
                  (err,product) => {}
                  )
                productVariant = await shopify.productVariant.list(req.params.product_id);
                Promise.all(productVariant.map(async (element) => {
                    await Product.findOneAndUpdate(
                      {  id: element.id},
                      {$set : {image_id:element.image_id}},
                      {new: true},
                      (err,product) => {}
                      )
                }));
              
                return res.json(
                  {message:"Image Removed Successfully"});
    
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

exports.productImageEdit =  (req,res) =>{

}    





exports.productVariationAdd =  (req,res) =>{
    const id = req.params.store_id;
    Integration.findOne({  store_id: id  })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
            product_variant = await shopify.productVariant.create(req.params.product_id, req.body.shopify_product_variant);
            
            

                product_variant_data = {

                        store_id : req.params.store_id,
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
            
            return res.json(
              {message:"Product Variant Created Successfully"});

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

exports.productVariationUpdate =  (req,res) =>{
    const id = req.params.store_id;
    Integration.findOne({ store_id: id  })
      .then( async data => {
        if (data) {
          
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
            product_variant = await shopify.productVariant.update(req.params.product_variant_id, req.body.shopify_product_variant);
            
                product_variant_data = {
                        
                        store_id : req.params.store_id,
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
                
                
                await ProductVariant.findOneAndUpdate(
                  { id: product_variant.id},
                  {$set : product_variant_data},
                  {new: true},
                  (err,product) => {}
                  )
            return res.json(
              {message:"Product Variant Updated Successfully"});

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

exports.productVariationDelete =  (req,res) =>{
    const id = req.params.store_id;
    Integration.findOne({ store_id: id  })
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
          
            await shopify.productVariant.delete(req.params.product_id, req.params.product_variant_id);
            await ProductVariant.deleteOne(
              {id: req.params.product_variant_id},
              (err,data) => {
                  
              }
              )
            
          
            return res.json(
              {message:"Product Variation Removed Successfully"});

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