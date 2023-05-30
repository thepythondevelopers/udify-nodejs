var express = require('express')
var router = express.Router()
const { check} = require("express-validator");


const {stripeSubscription,payNow,stripe_secret_key,createToken} = require("../controllers/stripe");
const {verifyToken,isAccountCheck,roleCheck,checkPlanForStripePayment} = require("../../middleware/auth");


router.post("/stripe",verifyToken,checkPlanForStripePayment,[
    check("number").notEmpty(),
    check("exp_month").notEmpty(),
    check("exp_year").notEmpty(),
    check("cvc").notEmpty(),
    check("billing_details_name").notEmpty(),
    check("public_id").notEmpty(),
    check("customerId").notEmpty(),
    check("priceId").notEmpty(),
],stripeSubscription);

router.post("/pay-now",verifyToken,[
    check("number").notEmpty(),
    check("exp_month").notEmpty(),
    check("exp_year").notEmpty(),
    check("cvc").notEmpty(),
    check("email").notEmpty(),
],payNow);

router.post("/create-token",verifyToken,[
    check("number").notEmpty(),
    check("exp_month").notEmpty(),
    check("exp_year").notEmpty(),
    check("cvc").notEmpty(),
],createToken);

router.get("/supplier-stripe-secret-key/:supplier_id",verifyToken,stripe_secret_key);

module.exports = router;
