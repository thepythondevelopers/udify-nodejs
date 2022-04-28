var express = require('express')
var router = express.Router()

const {syncProduct,syncCustomer} = require("../controllers/sync_shopify");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");

router.get("/sync-product/:integration_id",verifyToken,syncProduct);
router.get("/sync-customer/:integration_id",verifyToken,syncCustomer);

module.exports = router;