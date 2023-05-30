var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {syncProduct} = require("../controllers/product");



router.get("/sync-product",syncProduct);

module.exports = router;