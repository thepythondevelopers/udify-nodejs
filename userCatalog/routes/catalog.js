var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getSuppliersCatalog,addProduct,productSingleVendor} = require("../controllers/catalog");

const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");

router.post("/get-supplier-catalog",verifyToken,getSuppliersCatalog);
router.post("/add-product-catalog-shopify/:id/:store_id",verifyToken,addProduct);
router.post("/get-vendor-product/:user_id",verifyToken,productSingleVendor);



module.exports = router;
