var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getUsers,getUser,getUserToken} = require("../../controllers/admin/user");
const {verifyToken,isAccountCheck,adminroleCheck} = require("../../controllers/auth");


router.post("/admin/user",verifyToken,adminroleCheck,getUsers);
router.post("/admin/user/:user_id",verifyToken,adminroleCheck,getUser);
router.post("/admin/user-token/:user_id",verifyToken,adminroleCheck,getUserToken);

module.exports = router;
