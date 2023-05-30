var express = require('express')
var router = express.Router();
const multer = require('multer');

const {verifyToken} = require("../../middleware/auth");
const { createImage, getImages } = require('../controllers/productGallery');

const upload = multer({
    storage: multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,'uploads/gallery')
        },
        filename:function(req,file,cb){
            cb(null,file.filename+"-"+Date.now()+".jpg")
        }
    })
}).array("prod_img")

router.post("/upload-product-image",verifyToken,upload,createImage);
router.get("/get-product-images",verifyToken,getImages);



module.exports = router;
