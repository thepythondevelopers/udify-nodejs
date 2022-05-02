const db = require("../models");
const Account = db.account;
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
const { json } = require("body-parser");
require('dotenv').config();
const UserToken = db.userToken;
// Protected Routes

// exports.isSignedIn = expressJwt({
//     secret : process.env.SECRET,
//     userProperty : "auth"
// },function(req, res) {
//   console.log(req.user);
//   console.log('Hello');
// })
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
