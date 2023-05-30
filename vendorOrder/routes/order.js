var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getUserOrder,syncOrder,getSingleOrder} = require("../controllers/order");

const {verifyToken,supplierRoleCheck,isAccountCheck,checkStoreId} = require("../../middleware/auth");

router.post("/get-user-order",verifyToken,supplierRoleCheck,getUserOrder);
//router.get("/sync-order/:integration_id",verifyToken,supplierRoleCheck,syncOrder);
//router.post("/get-all-order-store",verifyToken,supplierRoleCheck,isAccountCheck,checkStoreId,getOrderAccordingtoStore);
router.get("/get-single-order/:order_id",verifyToken,supplierRoleCheck,getSingleOrder);




module.exports = router;
