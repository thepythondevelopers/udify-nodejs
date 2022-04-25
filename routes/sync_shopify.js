var express = require('express')
var router = express.Router()

const {syncProduct} = require("../controllers/sync_shopify");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");

router.get("/sync-product/:integration_id",verifyToken,syncProduct);


module.exports = router;