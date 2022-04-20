const uuid = require("uuid/v1");
const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
require('dotenv').config();
// var expressJwt = require('express-jwt');

exports.signup = (req,res)=>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }

  
  guid = uuid();
  guid = guid.replace(/-/g,""); 
  req.body.guid = guid;

  User
  .create(req.body)
  .then(user => {
    res.json({
      first_name : user.first_name,
      email : user.email,
      id : user.id
  });
  }).catch((err)=>{
    return res.status(400).json({
        message : "Unable to sabe in db",
        error : err 
    })
  })   
  
}; 

exports.signin = (req,res) =>{
  User.findOne({
    where: {
        email: req.body.email
           }
  }).then(function (user) {
   if (!user) {
      res.json('User Not Found');
   } else {
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (result == true) {
          //create token
        var token = jwt.sign({ _id: user._id }, process.env.SECRET);
        //create cookie
        res.cookie("token",token,{expire : new Date() + 9999});
        // send response
        const  {name,email,id} = user;
       
        res.json({token,user:{name,email,id}});
      } else {
        res.json("Incorrect Password");
      }
    });
  }
}).catch(err => {
  res.status(500).send({
    message:
      err.message || "Some error occurred while updating User Profile."
  });
});
}
exports.updateUser = (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(402).json({
            error : errors.array()
        })
    }
    const id = req.params.id;
    content =  { 
        first_name: req.body.first_name, 
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone
    }
    
    User.update(
      content,
      { where: { guid: id },
      deleted_at: {
        [Op.is]: null, 
      }
     }
    )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating User Profile."
      });
    });   
  }

  exports.forget_password = (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(402).json({
            error : errors.array()
        })
    }
    guid = uuid();
  token = guid.replace(/-/g,""); 
  
    content =  { 
      password_reset_token: token
    }
    User.findOne({
      where: {
          email: req.body.email
             }
    }).then(function (user) {
     if (!user) {
        res.json('User Not Found');
     } else {

    User.update(
      content,
      { where: { email: req.body.email }
     }
    )
    .then(data => {
      url = process.env.BASE_URL+'api/confirm-password/'+token
      res.send(url);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while generating reset password."
      });
    });
  } })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while checking user profile."
    });
  });
  } 

  exports.change_password = (req,res)=>{
    User.findOne({
      where: {
        password_reset_token: req.body.token
             }
    }).then(function (user) {
     if (!user) {
        res.json('Token Expire or Incorrect');
     } else { 
      content =  { 
        password: req.body.password,
        password_reset_token: ""
      }
      
      User.update(
        content,
        { where: { password_reset_token: req.body.token }
       }
      )
      .then(data => {
        
        res.send('Password Changed Successfully.');
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while generating reset password."
        });
      });


     }
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating password."
      });
    });
  }