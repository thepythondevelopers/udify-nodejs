var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {syncCustomer} = require("../controllers/customer");
const {verifyToken,isAccountCheck,roleCheck,checkStoreId} = require("../../middleware/auth");


router.get("/sync-customer",syncCustomer);

module.exports = router;