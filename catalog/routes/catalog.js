var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {createCatalog,getVendorCatalog,removeProductCatalog} = require("../controllers/catalog");

const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");

router.post("/create-catalog",verifyToken,createCatalog);
router.post("/get-vendor-catalog",verifyToken,getVendorCatalog);
router.post("/remove-product-catalog/:product_id",verifyToken,removeProductCatalog);



module.exports = router;
