require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const socketIO = require('socket.io');
const http = require('http');
let server = http.createServer(app)
app.set('view engine', 'ejs');
//Routes
const authRoutes = require("./authentication/routes/auth");
const adminUser = require("./admin/routes/user");
const aggrementRoutes = require("./agreement/routes/agreement");
const stripeRoutes = require("./stripe/routes/stripe");
const cmsPageRoutes = require("./cmsPage/routes/cms_pages");
const knowledgebaseRoutes = require("./knowledgebase/routes/knowledgebase");
const integrationRoutes = require("./integration/routes/integration");
const chatRoutes = require("./chat/routes/chat");
const supportRoutes = require("./support/routes/support");
const getInTouchRoutes = require("./getInTouch/routes/get_in_touch");
const planRoutes = require("./plan/routes/plan");
const OrderShopifyRoutes = require("./order/routes/order");
const customerRoutes = require("./customers/routes/customer");
const profileRoutes = require("./profile/routes/profile");
const productRoutes = require("./product/routes/product");
const productVariationRoutes = require("./product/routes/productVariation");
const vendorProductRoutes = require("./vendorProduct/routes/product");
const catalogRoutes = require("./catalog/routes/catalog");
const userCatalogRoutes = require("./userCatalog/routes/catalog");
const userVendorRoutes = require("./userVendor/routes/userVendor");
const vendorCustomerRoutes = require("./vendorCustomer/routes/vendorCustomer");
const vendorOrderRoutes = require("./vendorOrder/routes/order");

const productGalleryRoutes = require("./vendor-product-gallery/routes/productGallery")

const pubSubCustomerRoutes = require("./pub-sub-customers/routes/customer");
const pubSubOrderRoutes = require("./pub-sub-orders/routes/order");
const pubSubProductRoutes = require("./pub-sub-products/routes/product");

const awareRoutes = require("./aware/routes/aware");

//Connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
     useFindAndModify: false,
 
}).then(()=>{
    console.log('DATA CONNECTED');
}).catch((err)=>{
    console.log(err);
})


app.use(express.static('uploads/avatar')); 
app.use('/uploads/avatar', express.static('uploads/avatar'));
app.use(express.static('uploads/email')); 
app.use('/uploads/email', express.static('uploads/email'));
app.use(express.static('uploads/support')); 
app.use('/uploads/support', express.static('uploads/support'));
app.use(express.static('uploads/gallery'));

const port = process.env.PORT || 8000;

console.log("port::",port);

app.use(bodyParser.json({
    limit: '50mb'
  }));
app.use(cookieParser());
app.use(cors());

//My Routes
app.use('/authentication-node',authRoutes);
app.use('/admin-node',adminUser);
app.use('/agreement-node',aggrementRoutes);
app.use('/cms-node',cmsPageRoutes);
app.use('/knowledgebase-node',knowledgebaseRoutes);
app.use('/integration-node',integrationRoutes);
app.use('/chat-node',chatRoutes);
app.use('/support-node',supportRoutes);
app.use('/get-in-touch-node',getInTouchRoutes);
app.use('/stripe-node',planRoutes);
app.use('/stripe-node',stripeRoutes);
app.use('/order-node',OrderShopifyRoutes);
app.use('/customer-node',customerRoutes);
app.use('/profile-node',profileRoutes);
app.use('/product-node',productRoutes);
app.use('/product-node',productVariationRoutes);
app.use('/vendor-product-node',vendorProductRoutes);
app.use('/catalog-node',catalogRoutes);
app.use('/user-catalog-node',userCatalogRoutes);
app.use('/user-vendor-node',userVendorRoutes);
app.use('/vendor-customer-node',vendorCustomerRoutes);
app.use('/vendor-order-node',vendorOrderRoutes);

app.use('/vendor-gallery-node',productGalleryRoutes);

app.use('/pub-sub-customer-node',pubSubCustomerRoutes);
app.use('/pub-sub-order-node',pubSubOrderRoutes);
app.use('/pub-sub-product-node',pubSubProductRoutes);

app.use('/aware-node',awareRoutes);

app.get('/', (req, res)=>{
 
  
  res.render('home');
   
  });

// app.listen(port,()=>{
//     console.log(`Server is running at port ${port}`)
// });

server.listen(port);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
  io.on('connection', (socket) => {
    console.log('Hello');
    socket.on('customer', (data) => {
      io.emit('customer', {"message":data.msg,"send_to":data.send_to,"send_by":data.send_by});
      console.log("customer")
      console.log(data.msg)
      console.log(data.send_to)
      console.log(data.send_by)
    });
       socket.on('vendor', (data) => {
      io.emit('vendor', {"message":data.msg,"send_to":data.send_to,"send_by":data.send_by});
      console.log("vendor")
      console.log(data.msg)
      console.log(data.send_to)
      console.log(data.send_by)
    });
    
  });