var express = require('express')
var router = express.Router()

const {getCustomer,getOrder,getProduct,getShopify,getSingleProduct} = require("../controllers/shopify");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");

router.get("/customer/:integration_id",getCustomer);
router.get("/order/:integration_id",getOrder);
router.get("/product/:integration_id",getProduct);

router.get("/get-shopify",getShopify);
router.get("/get-single-shopify/:product_id",verifyToken,getSingleProduct);


module.exports = router;