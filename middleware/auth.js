const db = require("../models");
const Account = db.account;
const User = db.user;
const Integration = db.integration;
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
const { json } = require("body-parser");
const { integration, support } = require("../models");
require('dotenv').config();
const UserToken = db.userToken;
const Support = db.support;
const Op = db.Sequelize.Op;
var pluck = require('arr-pluck');
// Protected Routes


exports.verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({error:"A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    
    user_token = await UserToken.findOne({
      where: {
         token: token
      }
   });
   if (user_token === null) {
    return res.status(401).send({
      error : "Token Not Found"
    });
  }
  req.user = decoded;
  
  check_user = await User.findOne({ where: { guid: req.user.id,
    deleted_at: {
      [Op.is]: null, 
    }
  
  }});
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
    
  const acc = await Account.findOne({ where: { public_id: req.user.id } });
if (acc === null) {
  return res.status(404).json({
    error  : "Account Not Found"
})
} else {
  req.body.account_id = acc.guid;
}

    next();  
}

exports.checkStoreId = async(req,res,next)=>{
  if(req.body.store_id !=0){
    body_store_id = req.body.store_id;
    const inte = await Integration.findAll({ 
    attributes:  ['store_id'],
    where: { account_id: req.body.account_id },        deleted_at: {
    [Op.is]: null, 
  } });
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

exports.ticketStatusCheck = async (req,res,next) =>{
  parent_id = req.params.parent_id;
  support_data = await Support.findOne({ where: {id :parent_id }}); 
  
  if(support_data!=null && support_data.status=='Closed'){
   return res.json({message:"Ticket Already Closed"})
  }
  next();
}

exports.checkPlanForStripePayment = async (req,res,next) =>{
  id = req.body.public_id;
  
  user_data = await User.findOne({ where: {guid :id }}); 
    
  if(user_data!=null && user_data.plan_status!='trial'){
   return res.json({message:"Already Purchased the Plan."})
  }
  next();
}