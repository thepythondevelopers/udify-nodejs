var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
var multer = require('multer');
const {getSingleProduct,getProductAccordingtoStore,syncProduct,getProduct,csvProduct} = require("../controllers/product");
const {verifyToken,isAccountCheck,roleCheck,checkStoreId,supplierRoleCheck} = require("../../middleware/auth");
const os = require('os')
// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//       cb(null,"./uploads/avatar")
//     },
//     filename : function(req,file,cb){
//       cb(null,Date.now()+file.originalname)
//     }
//   })
  
//   const fileFilter = (req,file,cb)=>{
//     console.log(file.mimetype);
//     if(file.mimetype==='text/csv'){
//       cb(null,true)
//     }else{
//       cb(null,false)
//     }
//   }
//   var upload = multer({
//    // storage:storage,
//     fileFilter:fileFilter
//   })

  const upload = multer({ dest: os.tmpdir() })
router.get("/get-single-shopify/:product_id",verifyToken,getSingleProduct);

//router.get("/sync-product/:integration_id",verifyToken,syncProduct);

//router.post("/get-all-product-store",verifyToken,isAccountCheck,checkStoreId,getProductAccordingtoStore);
router.post("/get-all-product",verifyToken,getProduct);

router.post("/csv-product",upload.single('file'),verifyToken,supplierRoleCheck,csvProduct);









module.exports = router;