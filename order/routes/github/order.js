var express = require('express')
var router = express.Router()
const { check} = require("express-validator");


const {getOrderAccordingtoStore,getSingleOrder,syncOrder,orderProductSupplierInfo,catalogUserOrderList} = require("../controllers/order");
const {verifyToken,isAccountCheck,roleCheck,checkStoreId} = require("../../middleware/auth");




router.post("/get-all-order-store",verifyToken,isAccountCheck,checkStoreId,getOrderAccordingtoStore);
router.post("/catalog-user-order-list",verifyToken,catalogUserOrderList);

router.get("/get-single-order/:order_id",verifyToken,getSingleOrder);
router.get("/sync-order/:integration_id",verifyToken,syncOrder);
router.post("/order-product-supplier/:product_id",verifyToken,orderProductSupplierInfo);


module.exports = router;
