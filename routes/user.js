var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;

const {updateUser,signup,signin,forget_password,change_password,get_profile,logout} = require("../controllers/user");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");


router.post("/update-user-profile",verifyToken,[

    check("first_name").isLength({max : 255}).notEmpty(),
    check("last_name").isLength({max : 255}).notEmpty(),
    // check("email").isLength({max : 255}).isEmail().custom(userEmail=> {
      
      
    //   return new Promise((resolve, reject) => {
    //       User.findOne({ where: { email: userEmail } })
    //       .then(emailExist => {
    //           if(emailExist !== null){
    //             console.log(emailExist);
    //               reject(new Error('Email already exists.'))
    //           }else{
    //               resolve(true)
    //           }
    //       })
          
    //   })
    //   }).notEmpty(),
    check("phone").isLength({max : 45}).notEmpty(),
],updateUser);

router.post("/user-sign-up",[
  check("first_name").isLength({max : 255}).notEmpty(),
    check("last_name").isLength({max : 255}).notEmpty(),
    check("email").isLength({max : 255}).isEmail().custom(userEmail=> {
      
      
      return new Promise((resolve, reject) => {
          User.findOne({ where: { email: userEmail } })
          .then(emailExist => {
              if(emailExist !== null){
                console.log(emailExist);
                  reject(new Error('Email already exists.'))
              }else{
                  resolve(true)
              }
          })
          
      })
      }).notEmpty(),
    check("account_id").isLength({max : 32}).notEmpty(),
    check("notification_email_list").isLength({max : 1024}).notEmpty(),
],signup);
router.post("/user-sign-in",[
  check("email").isLength({max : 255}).isEmail().notEmpty(),
    check("password").isLength({max : 255}).notEmpty(),
],signin);

router.post("/forget-password",[
  check("email").isLength({max : 255}).isEmail().notEmpty()
],forget_password);

router.post("/change-password",[
  check("token").notEmpty(),
  check("password").isLength({max : 255}).notEmpty(),
],change_password);

router.get("/get-profile",verifyToken,get_profile);

router.get("/logout",verifyToken,logout);

module.exports = router;
