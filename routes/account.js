var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {createAccount,findAccount,findAllAccount,updateAccount,deleteAccount} = require("../controllers/account");



router.post("/create-account",[
    check("name").isLength({max : 255}).notEmpty(),
    check("api_token").isLength({max : 32}).notEmpty(),
    check("public_id").isLength({max : 5}).notEmpty(),
    check("address_street").isLength({max : 255}).notEmpty(),
    check("address_unit").isLength({max : 255}).notEmpty(),
    check("address_city").isLength({max : 255}).notEmpty(),
    check("address_state").isLength({max : 2}).notEmpty(),
    check("address_zip").isLength({max : 255}).notEmpty(),
    check("address_country").isLength({max : 2}).notEmpty(),
    check("stripe_customer_id").isLength({max : 80}).notEmpty(),
],createAccount);
router.get("/get-account/:id",findAccount);
router.get("/get-account-all",findAllAccount);
router.post("/update-account/:id",[
    check("name").isLength({max : 255}).notEmpty(),
    check("api_token").isLength({max : 32}).notEmpty(),
    check("public_id").isLength({max : 5}).notEmpty(),
    check("address_street").isLength({max : 255}).notEmpty(),
    check("address_unit").isLength({max : 255}).notEmpty(),
    check("address_city").isLength({max : 255}).notEmpty(),
    check("address_state").isLength({max : 2}).notEmpty(),
    check("address_zip").isLength({max : 255}).notEmpty(),
    check("address_country").isLength({max : 2}).notEmpty(),
    check("stripe_customer_id").isLength({max : 80}).notEmpty(),
],updateAccount);
router.delete('/delete-account/:id', deleteAccount);



module.exports = router;
