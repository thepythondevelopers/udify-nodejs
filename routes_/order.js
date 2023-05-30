var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;

const {getOrderAccordingtoStore,getSingleOrder} = require("../controllers/order");
const {verifyToken,isAccountCheck,roleCheck,checkStoreId} = require("../middleware/auth");




router.post("/get-all-order-store",verifyToken,isAccountCheck,checkStoreId,getOrderAccordingtoStore);
router.get("/get-single-order/:order_id",verifyToken,getSingleOrder);

module.exports = router;
