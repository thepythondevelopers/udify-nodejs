const Shopify = require('shopify-api-node');
const db = require("../models");
require('dotenv').config();
const Integration = db.integration;
const Product = db.product;
const ProductCustomData = db.productCustomData;
const ProductVariant = db.productVariant;
const ShopifyToken = require('shopify-token');
//const { json } = require('body-parser');

const Op = db.Sequelize.Op;
exports.getCustomer = (req,res) =>{
  page_info = req.body.page_info;
  const id = req.params.integration_id;
  Integration.findByPk(id)
    .then(data => {
      if (data) {
        const shopify = new Shopify({
          shopName: data.domain,
          accessToken: data.access_token
        });
        let params = { limit: process.env.PAGINATION_LIMIT,
          page_info: page_info};
        shopify.customer
        .list(params)
        .then((customers) => res.json(
          {data : customers,
          nextPage : customers.nextPageParameters,
        prevPage : customers.previousPageParameters }
          ))
        .catch((err) => res.json(err));
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

exports.getOrder = (req,res) =>{
  page_info = req.body.page_info;
  const id = req.params.integration_id;
  Integration.findByPk(id)
    .then(data => {
      if (data) {
        const shopify = new Shopify({
          shopName: data.domain,
          accessToken: data.access_token
        });
        let params = { limit: process.env.PAGINATION_LIMIT,
          page_info: page_info};
        shopify.order
        .list(params)
        .then((orders) => res.json(
          {data : orders,
          nextPage : orders.nextPageParameters,
        prevPage : orders.previousPageParameters }
          ))
        .catch((err) => res.json(err));
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

exports.getProduct = (req,res) =>{
  page_info = req.body.page_info;
  const id = req.params.integration_id;
  Integration.findByPk(id)
    .then(data => {
      if (data) {
        const shopify = new Shopify({
          shopName: data.domain,
          accessToken: data.access_token
        });
        let params = { limit: process.env.PAGINATION_LIMIT,
          page_info: page_info};
        
        shopify.product
        .list(params)
        .then((products) => res.json(
          {data : products,
          nextPage : products.nextPageParameters,
        prevPage : products.previousPageParameters }
          ))
        .catch((err) => res.json(err));
        
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




exports.getSingleProduct = async (req,res) =>{
  const id = req.params.product_id;
  result = await Product.findAll({
    where: {id : id},
    include: [{
        model: ProductVariant
    }]
  })
  return res.json(result);
}

exports.getShopify = (req,res) =>{
  const shopifyToken1 = new ShopifyToken({
    sharedSecret: '8b512161192bcabeb8924111a66a394b',
    redirectUri: 'http://localhost:8080/shopify/api/callback',
    apiKey: '5342f252555085c5f295c11b0b904bd3'
  });
  const nonce1 = shopifyToken1.generateNonce();

console.log(nonce1);
const url1 = shopifyToken1.generateAuthUrl('testing');
return res.json(url1);
const ok = shopifyToken.verifyHmac(url1);

console.log(ok);

 return res.json('r');
  const shopify = new Shopify({
    shopName: 'pamsar-test',
    // apiKey: 'cb2ed50cf1170e685d63912d8c363a92',
    accessToken: '42b26ad0494bdbc6e5b6973542622de4'
  });

  shopify.order
  .list({ limit: 5 })
  .then((orders) => console.log(orders))
  .catch((err) => console.error(err));
  return res.json('Okay');
  // config={
  //     shopName: 'pamsar.myshopify.com',
  //     apiKey: 'cf0bbf9bc3e2416ad13f44496a05c9cc',
  //     password: '35b41d6bacd5a4d2b3f40ef89eabf1af'
  //   }
  // var Shopify = new shopifyAPI(config), // You need to pass in your config here
  // query_params = req.query;

// Shopify.exchange_temporary_token(query_params, function(err, data){
  // This will return successful if the request was authentic from Shopify
  // Otherwise err will be non-null.
  // The module will automatically update your config with the new access token
  // It is also available here as data['access_token']
  // console.log(data);
// });
  // const shopify = new Shopify({
  //   shopName: 'pamsar.myshopify.com',
  //   apiKey: 'cf0bbf9bc3e2416ad13f44496a05c9cc',
  //   password: '35b41d6bacd5a4d2b3f40ef89eabf1af'
  // });
//   const shopify = new Shopify({
//     shopName: 'pamsar',
//     accessToken: '9e3191f8054b550d76f4b883c1135a2a'
//   });
  
//   shopify.product.list()
// .then(products =>  res.send(products))
// .catch(err =>  console.log(err));
// const shopifyToken = new ShopifyToken({
//   sharedSecret: '8ceb18e8ca581aee7cad1ddd3991610b',
//   redirectUri: 'http://localhost:8080/callback',
//   apiKey: 'cf0bbf9bc3e2416ad13f44496a05c9cc'
// });
// const nonce = shopifyToken.generateNonce();

// console.log(nonce);
const shopifyToken = new ShopifyToken({
  sharedSecret: 'b520bc1bfe3ec7acf502d11f60b9ac37',
  redirectUri: 'http://localhost:8000/auth/callback',
  apiKey: 'cb2ed50cf1170e685d63912d8c363a92'
});
const nonce = shopifyToken.generateNonce();


// const url = shopifyToken.generateAuthUrl('dolciumi');
const url =shopifyToken.generateAuthUrl('pamsar', '', nonce, '')
console.log(url);
return res.json(url);
}