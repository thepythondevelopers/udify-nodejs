var express = require('express')
var router = express.Router()

const {syncProduct,syncCustomer,syncOrder} = require("../controllers/sync_shopify");
const {verifyToken,isAccountCheck,roleCheck} = require("../middleware/auth");

router.get("/sync-product/:integration_id",verifyToken,syncProduct);
router.get("/sync-customer/:integration_id",verifyToken,syncCustomer);
router.get("/sync-order/:integration_id",verifyToken,syncOrder);
module.exports = router;