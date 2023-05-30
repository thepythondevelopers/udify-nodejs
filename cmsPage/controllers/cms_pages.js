const CmsPage = require("../../models/cms_pages");
const {validationResult} = require("express-validator");
require('dotenv').config();

exports.create_update_cms = async  (req,res)=>{
    
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }

 const cms_find = await CmsPage.findOne({type: req.body.type});
    if(cms_find===null){
        
        data = {    
            type: req.body.type,
            data : req.body.data
        }

        await CmsPage.create(data).then(cms_result => {
            res.json({"message" : "Cms Page Created Successfully."});
        }).catch((err)=>{
            return res.status(400).json({
                message : "Unable to sabe in db",
                error : err 
            })
        })   
    }else{
        data = {
            data : req.body.data
        }
        await CmsPage.findOneAndUpdate(
           {type: req.body.type},
            {$set : data},
            {new: true},
          )
          .then(data => {
            res.json({"message" : "Cms Page Updated Successfully."});
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while updating Integration."
            });
          });   
        
    }  
}


exports.getAllCmsPages = async  (req,res)=>{
    await CmsPage.find().then(cms_result => {
        res.json(cms_result);
    }).catch((err)=>{
        return res.status(400).json({
            message : "Some error occur",
            error : err 
        })
    })   
}

exports.getCmsPage = async  (req,res)=>{
    type = req.params.type;
    await CmsPage.findOne({type:type}).then(cms_result => {
        res.json(cms_result);
    }).catch((err)=>{
        return res.status(400).json({
            message : "Some error occur",
            error : err 
        })
    })   
}

exports.getAdminCmsPage = async  (req,res)=>{
    type = req.params.type;
    await CmsPage.findOne({type:type}).then(cms_result => {
        res.json(cms_result);
    }).catch((err)=>{
        return res.status(400).json({
            message : "Some error occur",
            error : err 
        })
    })   
}
