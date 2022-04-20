var express = require('express')
var router = express.Router()

const {plaid} = require("../controllers/plaid");


router.get("/plaid",plaid);


module.exports = router;