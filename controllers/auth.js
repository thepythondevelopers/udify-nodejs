const db = require("../models");
const Account = db.account;
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
// Protected Routes

// exports.isSignedIn = expressJwt({
//     secret : process.env.SECRET,
//     userProperty : "auth"
// },function(req, res) {
//   console.log(req.user);
//   console.log('Hello');
// })
exports.verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

// Custom Middleware



exports.isAccountCheck =(req,res,next)=>{
    if(req.headers.account_id==null){
            return res.status(404).json({
                err  : "Acccount Id Not Found"
            })
      }
      id = req.headers.account_id;
      Account.findByPk(id)
    .then(data => {
      if (data==null) { 
        res.status(404).send({
          message: `Cannot find Account with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Account with id=" + id
      });
    });

    req.body.account_id = req.headers.account_id;
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
