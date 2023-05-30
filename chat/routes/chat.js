var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {saveChat,getChat,getUserList,getSupplierList,chatNotification,markChatRead} = require("../controllers/chat");

const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");

router.post("/save-chat",[
    check("send_to").notEmpty(),
    check("message").notEmpty()
],verifyToken,saveChat);

router.post("/get-chat/:user_id",verifyToken,getChat);

router.post("/get-user-list",verifyToken,getUserList);

router.post("/get-supplier-list",verifyToken,getSupplierList);

router.post("/chat-notifcation",verifyToken,chatNotification);
router.post("/chat-read-mark/:send_by",verifyToken,markChatRead);


module.exports = router;
