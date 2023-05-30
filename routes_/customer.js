var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {getSingleCustomer,getCustomerAccordingtoStore,createCustomerShopify,deleteCustomerShopify,updateCustomerShopify,checkCustomerEmailExist,
    checkCustomerPhoneExist} = require("../controllers/customer");
const {verifyToken,isAccountCheck,roleCheck,checkStoreId} = require("../middleware/auth");



router.get("/get-single-customer/:customer_id",verifyToken,getSingleCustomer);

router.post("/get-all-customer-store",verifyToken,isAccountCheck,checkStoreId,getCustomerAccordingtoStore);

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


router.post("/customer-check-email-exist/:store_id",verifyToken,checkCustomerEmailExist);
router.post("/customer-check-phone-exist/:store_id",verifyToken,checkCustomerPhoneExist);


module.exports = router;