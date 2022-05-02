const uuid = require("uuid/v1");
const db = require("../models");
const User = db.user;
const UserToken = db.userToken;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require('stripe')(process.env.STRIPE_KEY);
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
    bcrypt.compare(req.body.password, user.password, async function (err, result) {
      if (result == true) {
          //create token
          
        var token = jwt.sign({ id: user.guid }, process.env.SECRET,{ expiresIn: '1d'  });
        guid = uuidv4();
        guid = guid.replace(/-/g,"");
        user_token_data = {
          id :guid,
          token : token 
        }
        await UserToken.create(user_token_data).then(function (user_token) {
          
        }).catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while updating User Profile."
          });
        });;
        //create cookie
        //res.cookie("token",token,{expire : new Date() + 9999});
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
    const id = req.user.id;
    content =  { 
        first_name: req.body.first_name, 
        last_name: req.body.last_name,
        // email: req.body.email,
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
      res.send('Successfully Updated');
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating User Profile."
      });
    });   
  }

  exports.forget_password =  (req,res)=>{
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
    .then(async data => {
      
      //url = process.env.BASE_URL+'api/confirm-password/'
      url = 'http://udify.pamsar.com/reset-password/'+token
      try {
        await sendGridMail.send(forgetpassword_email(req.body.email,url));
        console.log('Test email sent successfully');
        res.send({url:url,message:'Email Send Successfully'});
      } catch (error) {
        res.status(500).send({
          message:
            error.message || "Some error occurred while generating reset password."
        });
        // if (error.response) {
        //   console.error(error.response.body)
        // }
      }




      
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
    const password_reset_token = req.params.password_reset_token;
    User.findOne({
      where: {
        password_reset_token: password_reset_token
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
        { where: { password_reset_token: password_reset_token }
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

  exports.get_profile = (req,res)=>{

    User.findOne({
      where: {
        guid: req.user.id
             }
    }).then(function (user) {
     if (!user) {
        res.json('User Not Found.');
     } else {
      res.json(user);
     }
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting user."
      });
    });
  }

  function forgetpassword_email(email,url) {
    const body = `<p>Hello, Please click on the <a href="${url}">Link</a> to change the password</p>`;
    return {
      to: email,
      from: process.env.SENDGRID_FROM_ADDRESS,
      subject: 'Password Reset',
      text: body,
      html: `<strong>${body}</strong>`,
    };
  }
  
  exports.stripe = async (req,res)=>{
      const charge = await stripe.charges.create({
      amount: 2000,
      currency: 'usd',
      source: 'tok_mastercard',
      description: 'My First Test Charge (created for API docs)',
    });
    console.log(charge);
  }

exports.logout = (req,res) =>{
  const token =
  req.body.token || req.query.token || req.headers["x-access-token"];
  UserToken.destroy({
    where: {
       token: token
    }
 }).then(function(rowDeleted){
   if(rowDeleted === 1){
      res.status(200).send({
        message:"Logout Successfully"
      });
    }
 }, function(err){
  res.status(500).send({
    message:
      err.message || "Some error occurred."
  }); 
 });
}

exports.test = (req,res) =>{
  return res.json('Working');
}  