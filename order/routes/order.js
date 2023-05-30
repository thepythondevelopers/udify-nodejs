var express = require('express')
var router = express.Router()
const { check} = require("express-validator");


const {getOrderAccordingtoStore,getSingleOrder,syncOrder,orderProductSupplierInfo,updateOrderPayment,catalogUserOrderpayment,catalogUserOrderList,orderassign,orderPaymentAsk,orderSupplierId,orderSupplierName,orderCustomerId,orderCustomerNameEmail} = require("../controllers/order");
const {verifyToken,isAccountCheck,roleCheck,checkStoreId} = require("../../middleware/auth");




router.post("/get-all-order-store",verifyToken,isAccountCheck,checkStoreId,getOrderAccordingtoStore);
router.post("/catalog-user-order-list",verifyToken,catalogUserOrderList);
router.post("/get-order-payment",verifyToken,catalogUserOrderpayment);
router.post("/update-order-payment",verifyToken,updateOrderPayment);
router.post("/catalog-order-supplier",verifyToken,orderSupplierId);
router.post("/catalog-order-supplier-name",verifyToken,orderSupplierName);
router.post("/catalog-order-customer",verifyToken,orderCustomerId);
router.post("/catalog-order-customer-name-email",verifyToken,orderCustomerNameEmail);
router.get("/get-single-order/:order_id",verifyToken,getSingleOrder);
router.get("/sync-order/:integration_id",verifyToken,syncOrder);
router.post("/order-product-supplier/:product_id",verifyToken,orderProductSupplierInfo);
router.post("/order-assign-vendor/:order_id/:vendor_id",verifyToken,orderassign);
router.post("/order-assign-vendor/:id",verifyToken,orderPaymentAsk);

module.exports = router;
