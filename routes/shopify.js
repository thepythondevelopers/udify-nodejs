var express = require('express')
var router = express.Router()

const {getCustomer,getOrder,getProduct,getShopify} = require("../controllers/shopify");

router.get("/customer/:integration_id",getCustomer);
router.get("/order/:integration_id",getOrder);
router.get("/product/:integration_id",getProduct);

router.get("/get-shopify",getShopify);


module.exports = router;