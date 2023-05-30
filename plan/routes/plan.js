var express = require('express')
var router = express.Router()
const { check} = require("express-validator");


const {getPlan,createPlan,updatePlan,inactivePlan,activePlan,getPlanAdmin,checkSubscriptionStatus} = require("../controllers/plan");
const {verifyToken,adminroleCheck} = require("../../middleware/auth");


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


module.exports = router;
