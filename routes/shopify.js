var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {getSingleProduct,getSingleCustomer,getProductAccordingtoStore,getCustomerAccordingtoStore,createCustomerShopify,deleteCustomerShopify,updateCustomerShopify,deleteProductShopify,createProductShopify} = require("../controllers/shopify");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");


router.get("/get-single-shopify/:product_id",verifyToken,getSingleProduct);
router.get("/get-single-customer/:customer_id",verifyToken,getSingleCustomer);


router.post("/get-all-product-store",verifyToken,isAccountCheck,getProductAccordingtoStore);
router.post("/get-all-customer-store",verifyToken,getCustomerAccordingtoStore);

router.post("/create-customer/:store_id",verifyToken,[
        check("first_name").isLength({max : 45}).notEmpty(),
        check("last_name").isLength({max : 45}).notEmpty(),
        check("email").isLength({max : 80}).isEmail().notEmpty(),
        check("phone").isLength({max : 20}).notEmpty(),
        check("address1").isLength({max : 32}).notEmpty(),
        check("city").isLength({max : 60}).notEmpty(),
        check("province").isLength({max : 60}).notEmpty(),
        check("zip").isLength({max : 20}).notEmpty(),
        check("country").isLength({max : 10}).notEmpty()
],createCustomerShopify);

router.post("/update-customer/:store_id/:customer_id",verifyToken,[
    check("first_name").isLength({max : 45}).notEmpty(),
    check("last_name").isLength({max : 45}).notEmpty(),
    check("email").isLength({max : 80}).isEmail().notEmpty(),
    check("phone").isLength({max : 20}).notEmpty(),
    check("address1").isLength({max : 32}).notEmpty(),
    check("city").isLength({max : 60}).notEmpty(),
    check("province").isLength({max : 60}).notEmpty(),
    check("zip").isLength({max : 20}).notEmpty(),
    check("country").isLength({max : 10}).notEmpty()
],updateCustomerShopify);

router.post("/delete-shopify-customer/:store_id/:customer_id",verifyToken,deleteCustomerShopify);

router.post("/create-product/:integration_id",verifyToken,[
    check("title").isLength({max : 225}).notEmpty(),
    check("body_html").notEmpty(),
    check("vendor").isLength({max : 255}).notEmpty(),
    check("product_type").isLength({max : 255}).notEmpty()
],createProductShopify);
router.post("/delete-shopify-product/:integration_id/:product_id",verifyToken,deleteProductShopify);
module.exports = router;