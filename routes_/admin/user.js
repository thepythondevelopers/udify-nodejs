var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getUsers,getUser,getUserToken,disableUser,enableUser} = require("../../controllers/admin/user");
const {verifyToken,isAccountCheck,adminroleCheck} = require("../../middleware/auth");


router.post("/admin/user",verifyToken,adminroleCheck,getUsers);
router.post("/admin/user/:user_id",verifyToken,adminroleCheck,getUser);
router.post("/admin/user-token/:user_id",verifyToken,adminroleCheck,getUserToken);
router.post("/admin/user-disable/:user_id",verifyToken,adminroleCheck,disableUser);
router.post("/admin/user-enable/:user_id",verifyToken,adminroleCheck,enableUser);


module.exports = router;
