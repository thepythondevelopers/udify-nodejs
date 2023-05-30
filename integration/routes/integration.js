var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {createIntegration,findIntegration,findAllIntegration,updateIntegration,deleteIntegration} = require("../controllers/integration");

const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");

router.post("/create-integration",verifyToken,isAccountCheck,[
    check("store_api_key").isLength({max : 32}).notEmpty(),
    check("store_api_secret").isLength({max : 32}).notEmpty(),
    check("domain").isLength({max : 255}).notEmpty(),
    check("access_token").isLength({max : 255}).notEmpty()
],createIntegration);
router.get("/get-integration/:id",verifyToken,findIntegration);
router.get("/get-integration-all",verifyToken,isAccountCheck,findAllIntegration);
router.post("/update-integration/:id",[
    check("store_api_key").isLength({max : 32}).notEmpty(),
    check("store_api_secret").isLength({max : 32}).notEmpty(),
    check("domain").isLength({max : 255}).notEmpty(),
    check("access_token").isLength({max : 255}).notEmpty()
],updateIntegration);
router.delete('/delete-integration/:id',verifyToken,deleteIntegration);



module.exports = router;
