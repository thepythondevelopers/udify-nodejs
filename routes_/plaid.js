var express = require('express')
var router = express.Router()

const {plaid,checking} = require("../controllers/plaid");


router.get("/plaid",plaid);
router.get("/checking",checking);


module.exports = router;