var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const db = require("../models");
const User = db.user;
var multer = require('multer');
const {updateUserProfile2,updateUserProfile1,get_profile} = require("../controllers/profile");
const {verifyToken,isAccountCheck,roleCheck} = require("../middleware/auth");


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

router.post("/update-user-profile1",verifyToken,upload.single('avatar'),updateUserProfile1);

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


router.get("/get-profile",verifyToken,get_profile);



module.exports = router;
