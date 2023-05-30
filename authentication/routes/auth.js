var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const User = require("../../models/user");
const {signup,signupSupplier,signin,signinSupplier,signinAdmin,forget_password,change_password,updateUserStatus,logout} = require("../controllers/auth");

const {verifyToken} = require("../../middleware/auth");


router.post("/user-sign-up",[
  check("first_name").isLength({max : 255}).notEmpty(),
    check("last_name").isLength({max : 255}).notEmpty(),
    check("email").isLength({max : 255}).isEmail().custom((value, {req}) => {
      return new Promise((resolve, reject) => {
        User.findOne({email:req.body.email}, function(err, user){
          if(err) {
            reject(new Error('Server Error'))
          }
          if(Boolean(user)) {
            reject(new Error('E-mail already in use'))
          }
          resolve(true)
        });
      });
    }).notEmpty(),
    check("notification_email_list").isLength({max : 1024}).notEmpty(),
],signup);
router.post("/supplier-sign-up",[
  check("first_name").isLength({max : 255}).notEmpty(),
    check("last_name").isLength({max : 255}).notEmpty(),
    check("email").isLength({max : 255}).isEmail().custom((value, {req}) => {
      return new Promise((resolve, reject) => {
        User.findOne({email:req.body.email}, function(err, user){
          if(err) {
            reject(new Error('Server Error'))
          }
          if(Boolean(user)) {
            reject(new Error('E-mail already in use'))
          }
          resolve(true)
        });
      });
    }).notEmpty(),
    check("notification_email_list").isLength({max : 1024}).notEmpty(),
    check("phone").isLength({max : 1024}).notEmpty(),
    check("address_street").isLength({max : 1024}).notEmpty(),
    check("address_unit").isLength({max : 1024}).notEmpty(),
    check("address_city").isLength({max : 1024}).notEmpty(),
    check("address_state").isLength({max : 1024}).notEmpty(),
    check("address_zip").isLength({max : 1024}).notEmpty(),
    check("address_country").isLength({max : 1024}).notEmpty(),
    check("about").isLength({max : 1024}).notEmpty()
],signupSupplier);

router.post("/user-sign-in",[
  check("email").isLength({max : 255}).isEmail().notEmpty(),
    check("password").isLength({max : 255}).notEmpty(),
],signin);

router.post("/admin-sign-in",[
  check("email").isLength({max : 255}).isEmail().notEmpty(),
    check("password").isLength({max : 255}).notEmpty(),
],signinAdmin);

router.post("/supplier-sign-in",[
  check("email").isLength({max : 255}).isEmail().notEmpty(),
    check("password").isLength({max : 255}).notEmpty(),
],signinSupplier);

router.post("/forget-password",[
  check("email").isLength({max : 255}).isEmail().notEmpty()
],forget_password);

router.post("/change-password/:password_reset_token",[
  // check("token").notEmpty(),
  
  check("password").isLength({max : 255}).notEmpty(),
],change_password);


router.post("/user-status",verifyToken,updateUserStatus);
router.get("/logout",verifyToken,logout);

module.exports = router;
