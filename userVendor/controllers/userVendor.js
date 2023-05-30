const Shopify = require('shopify-api-node');
const User = require("../../models/user");
const {validationResult} = require("express-validator");
var pluck = require('arr-pluck');
const UserVendorProduct = require("../../models/userVendorProduct");
const FavouriteVendor = require("../../models/favouriteVendor");
const Agreement = require("../../models/agreement");
exports.getUserVendor =  async (req,res) =>{
    
  supplier_id = await UserVendorProduct.find({user_id : req.user._id}).select('supplier_id');
  supplier_id = pluck(supplier_id, 'supplier_id');
  supplier = await User.find({_id: { $in: supplier_id }}).select('-password')
  return res.json(supplier);

  }    

  exports.getUserSingleVendor =  async (req,res) =>{
    
    
    supplier = await User.findOne({ _id: req.params.id,access_group: 'supplier'}).populate('account_id').select('-password');
    favourite = await FavouriteVendor.find({user_id : req.user._id,supplier_id :req.params.id });
    aggreement = await Agreement.findOne({user : req.user._id,supplier : req.params.id});
    return res.json({data:supplier,favourite:favourite,aggreement:aggreement});
  
    }    

  exports.getUserFavouriteVendor =  async (req,res) =>{
    
    supplier_id = await FavouriteVendor.find({user_id : req.user._id}).select('supplier_id');
    supplier_id = pluck(supplier_id, 'supplier_id');
    supplier = await User.find({_id: { $in: supplier_id }}).select('-password')
    return res.json(supplier);
  
    }    

  exports.addVendorFavourite =  async (req,res) =>{
    
    data = {
      user_id : req.user._id,
      supplier_id : req.params.supplier_id
    }
    await FavouriteVendor.create(data);
    return res.json({message: "Added to Favourite"});
  
    }   
    
    exports.removeVendorFavourite =  async (req,res) =>{
    
      
      FavouriteVendor.deleteOne(
        {user_id:req.user._id,supplier_id : req.params.supplier_id},
        (err,document) => {
            if(err){
                return res.status(404).json({
                    error : err
                })
            
            }
            
            if(document.deletedCount==1){
                return res.json({message: "Removed from Favourite"});
            }
            if(document.deletedCount==0){
                return res.status(404).json({
                    message : "No Data Found"
                })
            }
            return res.status(404).json({
                message : "Something Went Wrong"
            })
        }
        )
      }       