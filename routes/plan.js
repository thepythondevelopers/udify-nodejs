var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;

const {getPlan,createPlan,updatePlan,inactivePlan,activePlan,getPlanAdmin,checkSubscriptionStatus,test} = require("../controllers/plan");
const {verifyToken,isAccountCheck,adminroleCheck} = require("../middleware/auth");


router.post("/get-plan",getPlan);
router.post("/get-plan-admin",verifyToken,adminroleCheck,getPlanAdmin);
router.post("/create-plan",verifyToken,adminroleCheck,[
    check("price").notEmpty(),
    check("name").notEmpty(),
    check("type").notEmpty(),
    check("features").notEmpty()
],createPlan);
router.post("/update-plan/:app_id",verifyToken,adminroleCheck,[
    check("name").notEmpty(),
    check("type").notEmpty(),
    check("features").notEmpty()
],updatePlan);
router.post("/inactive-plan/:app_id",verifyToken,adminroleCheck,inactivePlan);
router.post("/active-plan/:app_id",verifyToken,adminroleCheck,activePlan);
router.post("/check-subscription-status",verifyToken,checkSubscriptionStatus);

router.get("/test",test);
module.exports = router;
