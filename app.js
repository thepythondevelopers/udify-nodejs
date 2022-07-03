require('dotenv').config();

const express = require("express");
//var mysql = require('mysql');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const redis = require('redis');

//Routes
const adminUser = require("./routes/admin/user");
const stripeRoutes = require("./routes/stripe");
const planRoutes = require("./routes/plan");
const syncOrderShopifyRoutes = require("./routes/order_sync");
const syncShopifyRoutes = require("./routes/sync_shopify");
const shopifyRoutes = require("./routes/shopify");
const accountRoutes = require("./routes/account");
const integrationRoutes = require("./routes/integration");
const plaidRoutes = require("./routes/plaid");
const userRoutes = require("./routes/user");
const shopifyProductRoutes = require("./routes/shopify_product");
const getInTouchRoutes = require("./routes/get_in_touch");
const supportRoutes = require("./routes/support");
const cmsPageRoutes = require("./routes/cms_pages");
const knowledgebaseRoutes = require("./routes/knowledgebase");
const path = require("path");



app.use(express.static('uploads/avatar')); 
app.use('/uploads/avatar', express.static('uploads/avatar'));
app.use(express.static('uploads/email')); 
app.use('/uploads/email', express.static('uploads/email'));
app.use(express.static('uploads/support')); 
app.use('/uploads/support', express.static('uploads/support'));






//Redis Implementation
const client = redis.createClient({ url: 'rediss://default:AVNS_H1ldRswWtOxMWL-@udify-redis-do-user-4912141-0.b.db.ondigitalocean.com:25061'});

  client.on('error', (err) => console.log('Redis Client Error', err)); 

  //client.set('key', 'value255');
  //const value =  client.get('key');
  
  // client.get("key", function(err, reply) {
  //   // reply is null when the key is missing
  //   console.log(reply);
  // });

const port = process.env.PORT || 8000;

app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(cookieParser());
app.use(cors());

//My Routes

app.use('/api/shopify',shopifyRoutes);
app.use('/api',accountRoutes);
app.use('/api',integrationRoutes);
app.use('/api',plaidRoutes);
app.use('/api',userRoutes);
app.use('/api',syncShopifyRoutes);
app.use('/api',syncOrderShopifyRoutes);
app.use('/api',shopifyProductRoutes);
app.use('/api',planRoutes);
app.use('/api',stripeRoutes);
app.use('/api',adminUser);
app.use('/api',getInTouchRoutes);
app.use('/api',supportRoutes);
app.use('/api',cmsPageRoutes);
app.use('/api',knowledgebaseRoutes);

const db = require("./models");



//db.sequelize.sync();

// db.sequelize.sync().then(() => {
//   console.log("Drop and re-sync db.");
// }).catch((error)=>{
//   console.log(error);
// });
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});

