var express = require('express')
var router = express.Router()

const {sendNotification,getNotification,deleteNotification} = require("../controllers/aware");

const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");

router.post("/send-notification",verifyToken,sendNotification);

router.get("/get-notification",verifyToken,getNotification);

router.post("/delete-notification",verifyToken,deleteNotification);

module.exports = router;
