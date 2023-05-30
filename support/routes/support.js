var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
var multer = require('multer');

const {createSupport,replyTicketSupport,getTicket,getAllTicket,getAllTicketAdmin,getTicketNotificationUser,getTicketNotificationAdmin,readNotificationUser,readNotificationAdmin,replyTicketSupportUser,forgotTicketId,ticketStatusChange} = require("../controllers/support");
const {verifyToken,adminroleCheck,ticketStatusCheck} = require("../../middleware/auth");

const storage = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,"./uploads/support")
    },
    filename : function(req,file,cb){
      cb(null,Date.now()+file.originalname)
    }
  })
  
  const fileFilter = (req,file,cb)=>{
    
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/jpg'){
      cb(null,true)
    }else{
      cb(null,false)
    }
  }
  var upload = multer({
    storage:storage,
    fileFilter:fileFilter
  })

router.post("/create-support",verifyToken,[
    check("name").isLength({max : 255}).notEmpty(),
    check("subject").isLength({max : 255}).notEmpty(),
    check("message").notEmpty()
],upload.array('attachment'),createSupport);

router.post("/create-support-without",[
    check("name").isLength({max : 255}).notEmpty(),
    check("subject").isLength({max : 255}).notEmpty(),
    check("email").isEmail().isLength({max : 255}).notEmpty(),
    check("message").notEmpty()
],upload.array('attachment'),createSupport);

router.post("/reply-support-ticket/:parent_id",verifyToken,adminroleCheck,ticketStatusCheck,[
    check("message").notEmpty(),
],upload.array('attachment'),replyTicketSupport);
router.post("/reply-support-ticket-user/:parent_id",ticketStatusCheck,[
  check("message").notEmpty(),
],upload.array('attachment'),replyTicketSupportUser);

router.post("/get-ticket/:id",getTicket);
router.post("/forgot-ticket-id",[
  check("email").isEmail().notEmpty(),
  check("status").notEmpty()
],forgotTicketId);

router.post("/get-all-ticket",verifyToken,getAllTicket);
router.post("/get-all-ticket-admin",verifyToken,adminroleCheck,getAllTicketAdmin);
router.post("/get-ticket-notification-admin",verifyToken,adminroleCheck,getTicketNotificationAdmin);
router.post("/get-ticket-notification-user",verifyToken,getTicketNotificationUser);
router.post("/read-ticket-notification-user/:id",verifyToken,readNotificationUser);
router.post("/read-ticket-notification-admin/:id",verifyToken,adminroleCheck,readNotificationAdmin);

router.post("/ticket-status-change/:parent_id",ticketStatusCheck,[
  check("status").notEmpty()
],ticketStatusChange);

module.exports = router;
