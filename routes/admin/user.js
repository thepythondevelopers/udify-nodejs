var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getUsers,getUser} = require("../../controllers/admin/user");
const {verifyToken,isAccountCheck,adminroleCheck} = require("../../controllers/auth");


router.post("/admin/user",verifyToken,adminroleCheck,getUsers);
router.post("/admin/user/:user_id",verifyToken,adminroleCheck,getUser);

module.exports = router;
