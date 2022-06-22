var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;

const {createSupport,replyTicketSupport,getTicket,getAllTicket,getAllTicketAdmin,getTicketNotificationUser,getTicketNotificationAdmin,readNotificationUser,readNotificationAdmin} = require("../controllers/support");
const {verifyToken,isAccountCheck,adminroleCheck} = require("../controllers/auth");


router.post("/create-support",verifyToken,[
    check("message").notEmpty()
],createSupport);
router.post("/reply-support-ticket/:parent_id",verifyToken,[
    check("message").notEmpty(),
    check("parent_id").notEmpty()
],replyTicketSupport);
router.post("/get-ticket/:id",verifyToken,getTicket);
router.post("/get-all-ticket",verifyToken,getAllTicket);
router.post("/get-all-ticket-admin",verifyToken,adminroleCheck,getAllTicketAdmin);
router.post("/get-ticket-notification-admin",verifyToken,adminroleCheck,getTicketNotificationAdmin);
router.post("/get-ticket-notification-user",verifyToken,getTicketNotificationUser);
router.post("/read-ticket-notification-user/:id",verifyToken,readNotificationUser);
router.post("/read-ticket-notification-admin/:id",verifyToken,adminroleCheck,readNotificationAdmin);



module.exports = router;
