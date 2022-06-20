var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {getInTouch} = require("../controllers/get_in_touch");


router.post("/get-in-touch",[
    check("first_name").notEmpty(),
    check("last_name").notEmpty(),
    check("email").notEmpty(),
    check("supplier").notEmpty(),
    check("state").notEmpty()
],getInTouch);




module.exports = router;
