const Shopify = require('shopify-api-node');
const User = require("../../models/user");
const {validationResult} = require("express-validator");
var pluck = require('arr-pluck');
const UserVendorProduct = require("../../models/userVendorProduct");

exports.getVendorCustomer =  async (req,res) =>{
    
  user_id = await UserVendorProduct.find({supplier_id : req.user._id}).select('user_id');
  user_id = pluck(user_id, 'user_id');
  const search_string = req.body.search_string!=null ? req.body.search_string : "";
  const page = req.body.page!=null ? 1 : 0;
  const options = {
    page: page,
    limit: 10,
    select : '-password',
    collation: {
      locale: 'en',
    },
  };
  if(req.body.startedDate!=null && req.body.endDate!=null ){
  
    const startedDate = new Date(req.body.startedDate);
    const endDate = new Date(req.body.endDate);
    
    endDate.setDate(endDate.getDate() + 1);
    result = await User.paginate({ _id: { $in: user_id } ,
      created_at: {
        $gte: startedDate,
        $lte: endDate
    },
      $or:[
            {'first_name': { $regex: '.*' + `${search_string}` + '.*' }},
            {'last_name': { $regex: '.*' + `${search_string}` + '.*' }}
          ]
    }, options, function (err, result) {
      return res.json(result);
    });
  }else{
    result = await User.paginate({ _id: { $in: user_id } ,
      $or:[
            {'first_name': { $regex: '.*' + `${search_string}` + '.*' }},
            {'last_name': { $regex: '.*' + `${search_string}` + '.*' }}
          ]
    }, options, function (err, result) {
      return res.json(result);
    });
  }  
  

  } 
  
  exports.getUser =  async (req,res) =>{
    
    user = await User.find({_id: req.params.id}).populate('account_id').select('-password')
    return res.json(user);
  
    }    