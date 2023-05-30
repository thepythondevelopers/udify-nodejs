var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {syncOrder} = require("../controllers/order");



router.get("/sync-order",syncOrder);

module.exports = router;