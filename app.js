require('dotenv').config();

const express = require("express");
var mysql = require('mysql');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const redis = require('redis');

//Routes
const syncShopifyRoutes = require("./routes/sync_shopify");
const shopifyRoutes = require("./routes/shopify");
const accountRoutes = require("./routes/account");
const integrationRoutes = require("./routes/integration");
const plaidRoutes = require("./routes/plaid");
const userRoutes = require("./routes/user");

const path = require("path");
var multer = require('multer');
var fs = require('fs');
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"./uploads/")
  },
  filename : function(req,file,cb){
    cb(null,Date.now()+file.originalname)
  }
})

const fileFilter = (req,file,cb)=>{
  if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/jpg'){
    cb(null,true)
  }else{
    cb(null,false)
  }
}
var upload = multer({
  storage:storage,
  fileFilter:fileFilter
})
// app.use(express.static('uploads')); 
// app.use('/images', express.static('uploads'));


// fs.unlink('./uploads/1652172809118account.png', function (err) {
// 	if (err) throw err;
// 	// if no error, file has been deleted successfully
// 	console.log('File deleted!');
// });


app.post('/api/upload',upload.single('image'),async (req,res)=>{
  
  if(req.file){
    const pathName =req.file.path;
   return res.json(req.file,pathName);
  }
});
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

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use('/api/shopify',shopifyRoutes);
app.use('/api',accountRoutes);
app.use('/api',integrationRoutes);
app.use('/api',plaidRoutes);
app.use('/api',userRoutes);
app.use('/api',syncShopifyRoutes);

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

