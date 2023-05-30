require('dotenv').config();
var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const B2 = require('backblaze-b2');
const os = require('os')
var multer = require('multer');
const {updateUserProfile2,updateUserProfile1,get_profile,supplierProfileUpdate,blackblaze} = require("../controllers/profile");
const {verifyToken,isAccountCheck,roleCheck,supplierRoleCheck} = require("../../middleware/auth");



const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const blackupload = async (req, res, next) => {

    const b2 = new B2({
        applicationKeyId: process.env.BLACKBLAZE_KEYID, 
        applicationKey: process.env.BLACKBLAZE_APPLICATIONKEY, 
    });
    
    await b2.authorize(); 
    
    
    let response = await b2.getBucket({
        bucketName: process.env.BLACKBLAZE_NAME,
    });
    console.log("avatar::",req.files.avatar);
    if( typeof(req.files.avatar) != "undefined" && req.files.avatar !== null){
        
        response = await b2.getUploadUrl({
            bucketId: process.env.BLACKBLAZE_BucketID,
        })
        result = await b2.uploadFile({
            uploadUrl: response.data.uploadUrl,
            uploadAuthToken: response.data.authorizationToken,
            fileName: req.files.avatar[0].originalname,
            data: req.files.avatar[0].buffer,
        })
        //console.log("Result::",result);
        req.body.avatar={
            fileId : result.data.fileId,
            filename : result.data.fileName
        };
        
        
    }
    if( typeof(req.old_avatar_fileId) != "undefined" && req.old_avatar_fileId !== null){
        await b2.deleteFileVersion({
            fileId: req.old_avatar_fileId,
            fileName: old_avatar_filename
        });
    }

    if( typeof(req.files.cover) != "undefined" && req.files.cover !== null){

        response1 = await b2.getUploadUrl({
            bucketId: 'ffa48e26a7c456b970550c11',
        })
        result1 = await b2.uploadFile({
            uploadUrl: response1.data.uploadUrl,
            uploadAuthToken: response1.data.authorizationToken,
            fileName: req.files.cover[0].originalname,
            data: req.files.cover[0].buffer,
        })
        req.body.cover={
            fileId : result1.data.fileId,
            filename : result1.data.fileName
        };
           
    }
    if( typeof(req.old_cover_fileId) != "undefined" && req.old_cover_fileId !== null){
        await b2.deleteFileVersion({
            fileId: req.old_cover_fileId,
            fileName: old_cover_filename
        });
    }

    next();
}
router.post("/update-user-profile1",verifyToken,upload.fields([{name:'avatar',maxCount:1}]),blackupload,updateUserProfile1);

router.post("/update-user-profile2",verifyToken,[

  check("first_name").isLength({max : 255}).notEmpty(),
  check("last_name").isLength({max : 255}).notEmpty(),
  check("company").isLength({max : 255}).notEmpty(),
  check("name").isLength({max : 255}).notEmpty(),
  check("address_street").isLength({max : 255}).notEmpty(),
  check("address_city").isLength({max : 255}).notEmpty(),
  check("address_zip").isLength({max : 255}).notEmpty()
],updateUserProfile2);


router.get("/get-profile",verifyToken,get_profile);

router.post("/supplier-profile-update",verifyToken,supplierRoleCheck,upload.fields([{name:'avatar',maxCount:1},{name:'cover',maxCount:1}]),blackupload,supplierProfileUpdate);

router.post("/blackblaze",upload.fields([{name:'avatar',maxCount:1}]),blackupload,blackblaze);

module.exports = router;
