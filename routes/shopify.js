var express = require('express')
var router = express.Router()

const {getSingleProduct,getSingleCustomer,getProductAccordingtoStore,getCustomerAccordingtoStore} = require("../controllers/shopify");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");


router.get("/get-single-shopify/:product_id",verifyToken,getSingleProduct);
router.get("/get-single-customer/:customer_id",verifyToken,getSingleCustomer);


router.get("/get-all-product-store",verifyToken,isAccountCheck,getProductAccordingtoStore);
router.get("/get-all-customer-store",verifyToken,getCustomerAccordingtoStore);
module.exports = router;