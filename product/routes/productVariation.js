var express = require('express')
var router = express.Router()
const { check} = require("express-validator");


const {productImageAdd,productImageDelete,productVariationAdd,productVariationUpdate,productVariationDelete} = require("../controllers/productVariation");
const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");


router.post("/shopfiy-product-image-delete/:store_id/:product_id/:image_id",verifyToken,productImageDelete);
router.post("/shopfiy-product-image-create/:store_id/:product_id",verifyToken,productImageAdd);

router.post("/shopfiy-product-variant-create/:store_id/:product_id",verifyToken,productVariationAdd);
router.post("/shopfiy-product-variant-update/:store_id/:product_variant_id",verifyToken,productVariationUpdate);
router.post("/shopfiy-product-variant-delete/:store_id/:product_id/:product_variant_id",verifyToken,productVariationDelete);

module.exports = router;
