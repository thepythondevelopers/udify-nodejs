const Integration = require("../../models/integration");
const {validationResult} = require("express-validator");
const Shopify = require('shopify-api-node');
const { v4: uuidv4 } = require('uuid');
const Product = require("../../models/products");
const ProductVariant = require("../../models/product_variants");
const Order = require("../../models/order");
const Customer = require("../../models/customer");
const VendorProduct = require("../../models/vendorProducts");
const VendorProductVariant = require("../../models/vendorProductVariants");
const OrderVendor = require("../../models/orderVendor");

exports.createIntegration = async (req,res) =>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
  const shopify = new Shopify({
    shopName: req.body.domain,
    accessToken: req.body.access_token
  });
  let params = { limit: 1 };
            const products = await shopify.product.list(params).then( async data => {
 
   integration_found = await Integration.findOne({store_api_key:req.body.store_api_key,
    store_api_secret:req.body.store_api_secret,
    domain:req.body.domain,
    //user_id : req.user._id
    });
    if(integration_found!=null){
        return res.status(400).json({
            //message : "This Shopify Account is already in your Account."
            message : "This Shopify Account is already in someone's account on udify."
        })
    }             
  store_id = uuidv4();
  store_id = store_id.replace(/-/g,"");
  req.body.store_id = store_id;
  req.body.user_id = req.user._id;
  
  req.body.role = req.user.access_group;      

     await Integration
      .create(req.body)
      .then(integration => {
        return res.json(integration);
      }).catch((err)=>{
        return res.status(400).json({
            message : "Unable to save in db",
            error : err 
        })
      })  
            }).catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while Syncing."
              });
            });
   
}

exports.findIntegration = (req,res) =>{
    const id = req.params.id;
    Integration.findOne({_id:id,user_id :req.user._id,deleted_at: null}).exec((err,integration)=>{
        if(err){
            return res.status(400).json({
                message : "Something Went Wrong"
            })
        }
        return res.json(integration);
    })    
  }
  
exports.findAllIntegration = (req, res) => {
    
    Integration.find({user_id :req.user._id,deleted_at: null}).select('-access_token -store_api_key -store_api_secret').exec((err,integration)=>{
      if(err){
          return res.status(400).json({
              message : "No Data Found"
          })
      }
      return res.json(integration);
  })    



}

exports.updateIntegration = async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
  const id = req.params.id;
  content =  { store_api_key: req.body.store_api_key, 
    store_api_secret: req.body.store_api_secret,
    domain: req.body.domain,
    access_token: req.body.access_token
  }
  
  integration_found = await Integration.findOne({ _id: { $ne: id },store_api_key:req.body.store_api_key,
    store_api_secret:req.body.store_api_secret,
    domain:req.body.domain});
    if(integration_found!=null){
        return res.status(401).json({
            message : "This Shopify Account is already in your Account."
        })
    }

  Integration.findOneAndUpdate(
    { _id: id ,account_id :req.body.account_id,deleted_at:null},
    {$set : content},
    {new: true},
    (err,integration) => {
        if(err){
            return res.status(404).json({
                error : err
            })
        
        }

        if(integration===null){
            return res.status(404).json({
                message : "No Data Found"
            })
        }

        return res.json(integration);
    }
    )   
}

exports.deleteIntegration = (req,res)=>{
    
  const id = req.params.id;
    content = {
        deleted_at : new Date()
    }
    Integration.findOneAndUpdate(
        { _id: id ,user_id :req.user._id,deleted_at:null},
        {$set : content},
        {new: true},
        (err,integration) => {
            if(err){
                return res.status(404).json({
                    error : err
                })
            
            }
    
            if(integration===null){
                return res.status(404).json({
                    message : "No Data Found"
                })
            }
    
            return res.json(integration);
        })
}