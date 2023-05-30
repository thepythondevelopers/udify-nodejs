var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {create_update_cms,getAllCmsPages,getCmsPage,getAdminCmsPage} = require("../controllers/cms_pages");
const {verifyToken,adminroleCheck} = require("../../middleware/auth");


router.post("/create-update-cms",verifyToken,adminroleCheck,[
    check("data").notEmpty(),
    check("type").notEmpty()
],create_update_cms);

router.post("/get-all-cms-pages",verifyToken,adminroleCheck,getAllCmsPages);
router.post("/get-cms-page/:type",getCmsPage);
router.post("/get-admin-cms-page/:type",verifyToken,adminroleCheck,getAdminCmsPage);



module.exports = router;
