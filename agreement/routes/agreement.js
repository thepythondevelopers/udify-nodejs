var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {aggreement,checkAggreement} = require("../controllers/agreement");

const {verifyToken,userRoleCheck} = require("../../middleware/auth");

router.post("/aggreement/:supplier",verifyToken,userRoleCheck,aggreement);

router.post("/check-aggreement/:supplier",verifyToken,userRoleCheck,checkAggreement);



module.exports = router;
