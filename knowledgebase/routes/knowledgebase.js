var express = require('express')
var router = express.Router()
const { check} = require("express-validator");


const {createBase,updateBase,getBase,destroyBase,getBaseById} = require("../controllers/knowledgebase");
const {verifyToken,adminroleCheck} = require("../../middleware/auth");


router.post("/create-base",verifyToken,adminroleCheck,[
    check("title").isLength({max : 255}).notEmpty(),
    check("category").isLength({max : 255}).notEmpty(),
    check("description").notEmpty()
],createBase);
router.post("/update-base/:id",verifyToken,adminroleCheck,[
    check("title").isLength({max : 255}).notEmpty(),
    check("category").isLength({max : 255}).notEmpty(),
    check("description").notEmpty()
],updateBase);
router.post("/destroy-base/:id",verifyToken,adminroleCheck,destroyBase);
router.post("/get-base",getBase);
router.post("/get-base-id/:id",getBaseById);


module.exports = router;
