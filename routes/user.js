var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;
var multer = require('multer');
const {updateUserProfile2,updateUserProfile1,signup,signin,forget_password,change_password,get_profile,logout} = require("../controllers/user");
const {verifyToken,isAccountCheck,roleCheck} = require("../controllers/auth");


const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"./uploads/avatar")
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

router.post("/update-user-profile1",verifyToken,[

    // check("location").isLength({max : 255}).notEmpty(),
    // check("website").isLength({max : 255}).notEmpty(),
    // check("about").notEmpty(),
    // check("avatar").notEmpty(),
],upload.single('avatar'),updateUserProfile1);

router.post("/update-user-profile2",verifyToken,[

  check("first_name").isLength({max : 255}).notEmpty(),
  check("last_name").isLength({max : 255}).notEmpty(),
  check("company").isLength({max : 255}).notEmpty(),
  check("name").isLength({max : 255}).notEmpty(),
  check("address_street").isLength({max : 255}).notEmpty(),
  check("address_city").isLength({max : 255}).notEmpty(),
  check("address_state").isLength({max : 2}).notEmpty(),
  check("address_zip").isLength({max : 255}).notEmpty(),
  check("address_country").isLength({max : 2}).notEmpty(),
],updateUserProfile2);

router.post("/user-sign-up",[
  check("first_name").isLength({max : 255}).notEmpty(),
    check("last_name").isLength({max : 255}).notEmpty(),
    check("email").isLength({max : 255}).isEmail().custom(userEmail=> {
      
      
      return new Promise((resolve, reject) => {
          User.findOne({ where: { email: userEmail } })
          .then(emailExist => {
              if(emailExist !== null){                
                  reject(new Error('Email already exists.'))
              }else{
                  resolve(true)
              }
          })
          
      })
      }).notEmpty(),
    check("notification_email_list").isLength({max : 1024}).notEmpty(),
],signup);
router.post("/user-sign-in",[
  check("email").isLength({max : 255}).isEmail().notEmpty(),
    check("password").isLength({max : 255}).notEmpty(),
],signin);

router.post("/forget-password",[
  check("email").isLength({max : 255}).isEmail().notEmpty()
],forget_password);

router.post("/change-password/:password_reset_token",[
  check("token").notEmpty(),
  check("password").isLength({max : 255}).notEmpty(),
],change_password);

router.get("/get-profile",verifyToken,get_profile);

router.get("/logout",verifyToken,logout);

module.exports = router;
