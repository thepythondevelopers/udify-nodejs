var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;

const {stripeSubscription} = require("../controllers/stripe");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");


router.post("/stripe",verifyToken,[
    check("user_id").notEmpty(),
    check("stripe_customer_id").notEmpty(),
    check("plan_id").notEmpty(),
],stripeSubscription);



module.exports = router;
