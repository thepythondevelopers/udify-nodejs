var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {getSingleProduct,getProductAccordingtoStore,deleteProductShopify,createProductShopify,updateProductShopify
    } = require("../controllers/product");
const {verifyToken,isAccountCheck,roleCheck,checkStoreId} = require("../middleware/auth");


router.get("/get-single-shopify/:product_id",verifyToken,getSingleProduct);



router.post("/get-all-product-store",verifyToken,isAccountCheck,checkStoreId,getProductAccordingtoStore);






router.post("/create-product/:store_id",verifyToken,createProductShopify);
router.post("/update-product/:store_id/:product_id",verifyToken,updateProductShopify);

router.post("/delete-shopify-product/:store_id/:product_id",verifyToken,deleteProductShopify);




module.exports = router;