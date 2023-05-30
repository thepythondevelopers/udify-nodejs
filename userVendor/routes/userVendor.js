var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getUserVendor,addVendorFavourite,removeVendorFavourite,getUserFavouriteVendor,getUserSingleVendor} = require("../controllers/userVendor");

const {verifyToken,userRoleCheck} = require("../../middleware/auth");

router.post("/get-user-vendor",verifyToken,userRoleCheck,getUserVendor);
router.post("/get-user-favourite-vendor",verifyToken,userRoleCheck,getUserFavouriteVendor);
router.post("/add-vendor-favourite/:supplier_id",verifyToken,userRoleCheck,addVendorFavourite);
router.post("/remove-vendor-favourite/:supplier_id",verifyToken,userRoleCheck,removeVendorFavourite);
router.post("/user-vendor/:id",verifyToken,userRoleCheck,getUserSingleVendor);




module.exports = router;
