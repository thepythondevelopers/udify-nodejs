var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getVendorCustomer,getUser} = require("../controllers/vendorCustomer");

const {verifyToken,supplierRoleCheck} = require("../../middleware/auth");

router.post("/get-customer",verifyToken,supplierRoleCheck,getVendorCustomer);
router.post("/get-user-customer/:id",verifyToken,supplierRoleCheck,getUser);




module.exports = router;
