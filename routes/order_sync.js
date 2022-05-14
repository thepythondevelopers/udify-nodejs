var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;

const {syncOrder,getOrderAccordingtoStore,getSingleOrder} = require("../controllers/shopify_order");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");


router.get("/shopify-order-sync/:integration_id",verifyToken,syncOrder);

router.post("/get-all-order-store",verifyToken,getOrderAccordingtoStore);
router.get("/get-single-order/:order_id",verifyToken,getSingleOrder);

module.exports = router;
