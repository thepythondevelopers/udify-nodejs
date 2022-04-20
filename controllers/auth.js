const db = require("../models");
const Account = db.account;
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
// Protected Routes

exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth"
})

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
