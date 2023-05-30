const UserToken = require("../models/userToken");
const User = require("../models/user");
const Account = require("../models/account");
const Support = require("../models/support");
const Integration = require("../models/integration");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const { json } = require("body-parser");
require('dotenv').config();
var pluck = require('arr-pluck');
// Protected Routes



exports.verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  
  if (!token) {
    return res.status(403).send({error:"A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    
    user_token = await UserToken.findOne({token: token});
   if (user_token === null) {
    return res.status(401).send({
      error : "Token Not Found"
    });
  }
  req.user = decoded;
  
  check_user = await User.findOne({  _id: req.user._id, deleted_at: null});
  if(check_user==null){
    await UserToken.destroy({
      where: {
        token: token 
      }
    })
    return res.json({"message" : "Inactive User"});
  }
    
  } catch (err_m) {
    return res.status(401).send({
      error : "Invalid Token",
      error_m :err_m
    });
  }
  return next();
};

// Custom Middleware



exports.isAccountCheck = async(req,res,next)=>{

  const acc = await Account.findOne({  user_id: req.user._id});

  if (acc === null) {
  return res.status(404).json({
    error  : "Account Not Found"
})
} else {
  req.body.account_id = acc._id;
}

    next();  
}

exports.checkStoreId = async(req,res,next)=>{
  
  if(req.body.store_id !=0){
    body_store_id = req.body.store_id;
    const inte = await Integration.find({account_id: req.body.account_id ,deleted_at: null }).select('store_id');

  user_store_id = pluck(inte, 'store_id');
  
  let intersection = user_store_id.filter(x => body_store_id.includes(x));
  req.body.store_id = intersection;
  }
  next();
}

exports.roleCheck = (req,res,next) =>{
    if(req.headers.role==null){
        return res.status(404).json({
            err  : "Role Not Found"
        })
    }  
    role =  req.headers.role; 
    if(role == 'user'){
        return res.status(403).json({
            err  : "Access Denied"
        })
    }
    
 
    next();
}


exports.adminroleCheck = (req,res,next) =>{
  
  if(req.user.access_group!='admin'){
      return res.status(404).json({
          err  : "Does't Not have permission."
      })
  }  
  next();
}

exports.supplierRoleCheck = (req,res,next) =>{
  
  if(req.user.access_group!='supplier'){
      return res.status(404).json({
          err  : "Does't Not have permission."
      })
  }  
  next();
}

exports.userRoleCheck = (req,res,next) =>{
  
  if(req.user.access_group!='user'){
      return res.status(404).json({
          err  : "Does't Not have permission."
      })
  }  
  next();
}

exports.ticketStatusCheck = async (req,res,next) =>{
  parent_id = req.params.parent_id;
  support_data = await Support.findOne({ _id :parent_id }); 
  
  if(support_data!=null && support_data.status=='Closed'){
   return res.json({message:"Ticket Already Closed"})
  }
  next();
}

exports.checkPlanForStripePayment = async (req,res,next) =>{
  id = req.body.public_id;
  
  user_data = await User.findOne({ where: {_id :id }}); 
    
  if(user_data!=null && user_data.plan_status!='trial'){
   return res.json({message:"Already Purchased the Plan."})
  }
  next();
}