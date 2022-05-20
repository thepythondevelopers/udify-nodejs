var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;

const {getPlan} = require("../controllers/plan");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");


router.post("/get-plan",getPlan);



module.exports = router;
