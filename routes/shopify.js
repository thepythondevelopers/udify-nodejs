var express = require('express')
var router = express.Router()

const {getCustomer,getOrder,getProduct,getShopify,getSingleProduct,getSingleCustomer,getAllCustomer,getAllProduct,getProductAccordingtoStore,getCustomerAccordingtoStore} = require("../controllers/shopify");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");

router.get("/customer/:integration_id",getCustomer);
router.get("/order/:integration_id",getOrder);
router.get("/product/:integration_id",getProduct);

router.get("/get-shopify",getShopify);
router.get("/get-single-shopify/:product_id",verifyToken,getSingleProduct);
router.get("/get-single-customer/:customer_id",verifyToken,getSingleCustomer);
//router.get("/get-all-customer",verifyToken,getAllCustomer);
//router.get("/get-all-product",verifyToken,getAllProduct);

router.get("/get-all-product-store",verifyToken,getProductAccordingtoStore);
router.get("/get-all-customer-store",verifyToken,getCustomerAccordingtoStore);
module.exports = router;