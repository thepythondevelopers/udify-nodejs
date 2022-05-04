var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;

const {createCustomerAndSubscription} = require("../controllers/stripe");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");


router.post("/stripe",verifyToken,[
    check("stripeToken").notEmpty(),
    check("customerEmail").isEmail().notEmpty(),
    check("planId").notEmpty(),
],createCustomerAndSubscription);



module.exports = router;
