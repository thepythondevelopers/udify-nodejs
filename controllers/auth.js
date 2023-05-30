const User = require("../models/user");
const UserToken = require("../models/userToken");
const Account = require("../models/account");
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require('stripe')(process.env.STRIPE_KEY);
const moment= require('moment') 

var fs = require('fs');
exports.signup =  (req,res)=>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }

 
  api_token  = uuidv4();
  api_token  = api_token.replace(/-/g,""); 
  const hash = bcrypt.hashSync(req.body.password, 10);
  user_data = {
    first_name: req.body.first_name,
    last_name : req.body.last_name,
    password : hash,
    email: req.body.email,
    notification_email_list:req.body.notification_email_list
  }

  
  User.create(user_data)
  .then(async user => {    
    const stripe_customer = await stripe.customers.create({
      email: req.body.email,
    });
    
    account_data = {
      name : req.body.first_name,
      api_token : api_token,
      user_id : user._id,
      stripe_customer_id : stripe_customer.id
    }
    account = await Account.create(account_data); 
    update_content = {account_id:account._id};
    await User.updateMany(
      {_id: user._id},
      {$set : update_content},
    )

    res.json({
      first_name : user.first_name,
      email : user.email,
      id : user._id
  });
  }).catch((err)=>{
    return res.status(400).json({
        message : "Something Went Wrong.",
        error : err 
    })
  })   
  
}; 

exports.signin = (req,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }
  
  const {email} = req.body;
  access_group ='user';
  
  User.findOne({email,access_group,'deleted_at' : null  }, function(err, user) {
    
   if (!user) {
      return res.json({error:'User Not Found'});
   } else {
    bcrypt.compare(req.body.password, user.password, async function (err, result) {
      if (result == true) {
          //create token          
          
        var token = jwt.sign({ _id: user._id,email:user.email,access_group:user.access_group }, process.env.SECRET,{ expiresIn: '1d'  });
        user_email = user.email;
        user_role = user.role;
        user_name = user.first_name +' '+ user.last_name; 

        

      await UserToken.create({token:token}).then( usertoken => {
      }).catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred."
        });
      });
      await UserToken.deleteOne({ createdAt:{$lte:moment().subtract(1, 'days').toDate()} });

        return res.json({token,user:{user_name,user_email,user_role}});
      } else {
        return res.json({error:"Incorrect Password"});
      }
    });
  }
}).catch(err => {
  return res.status(500).send({
    message:
      err.message || "Some error occurred."
  });
});

  


}

exports.signinSupplier = (req,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }
  
  const {email} = req.body;
  access_group ='supplier';
  
  User.findOne({email,access_group,'deleted_at' : null  }, function(err, user) {
    
   if (!user) {
      return res.json({error:'User Not Found'});
   } else {
    bcrypt.compare(req.body.password, user.password, async function (err, result) {
      if (result == true) {
          //create token          
          
        var token = jwt.sign({ _id: user._id,email:user.email,access_group:user.access_group }, process.env.SECRET,{ expiresIn: '1d'  });
        user_email = user.email;
        user_role = user.role;
        user_name = user.first_name +' '+ user.last_name; 

        

      await UserToken.create({token:token}).then( usertoken => {
      }).catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred."
        });
      });
      await UserToken.deleteOne({ createdAt:{$lte:moment().subtract(1, 'days').toDate()} });

        return res.json({token,user:{user_name,user_email,user_role}});
      } else {
        return res.json({error:"Incorrect Password"});
      }
    });
  }
}).catch(err => {
  return res.status(500).send({
    message:
      err.message || "Some error occurred."
  });
});

  


}


exports.signinAdmin = (req,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }
  
  const {email} = req.body;
  access_group ='admin';
  
  User.findOne({email,access_group,'deleted_at' : null  }, function(err, user) {
    
   if (!user) {
      return res.json({error:'User Not Found'});
   } else {
    bcrypt.compare(req.body.password, user.password, async function (err, result) {
      if (result == true) {
          //create token          
          
        var token = jwt.sign({ _id: user._id,email:user.email,access_group:user.access_group }, process.env.SECRET,{ expiresIn: '1d'  });
        user_email = user.email;
        user_role = user.role;
        user_name = user.first_name +' '+ user.last_name; 

        

      await UserToken.create({token:token}).then( usertoken => {
      }).catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred."
        });
      });
      await UserToken.deleteOne({ createdAt:{$lte:moment().subtract(1, 'days').toDate()} });

        return res.json({token,user:{user_name,user_email,user_role}});
      } else {
        return res.json({error:"Incorrect Password"});
      }
    });
  }
}).catch(err => {
  return res.status(500).send({
    message:
      err.message || "Some error occurred."
  });
});

  


}

exports.signupSupplier =  (req,res)=>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }

 
  api_token  = uuidv4();
  api_token  = api_token.replace(/-/g,""); 
  const hash = bcrypt.hashSync(req.body.password, 10);
  user_data = {
    first_name: req.body.first_name,
    last_name : req.body.last_name,
    password : hash,
    email: req.body.email,
    access_group : 'supplier',
    notification_email_list:req.body.notification_email_list,
    phone : req.body.phone
  }

  
  User.create(user_data)
  .then(async user => {
    
    const stripe_customer = await stripe.customers.create({
      email: req.body.email,
    });
  
    
    
    account_data = {
      name : req.body.first_name,
      api_token : api_token,
      user_id : user._id,
      stripe_customer_id : stripe_customer.id,
      address_street : req.body.address_street,
      address_unit : req.body.address_unit,
      address_city : req.body.address_city,
      address_state : req.body.address_state,
      address_zip : req.body.address_zip,
      address_country : req.body.address_country,
      about : req.body.about
    }
     
    account = await Account.create(account_data); 
    update_content = {account_id:account._id};
    await User.updateMany(
      {_id: user._id},
      {$set : update_content},
    )
    res.json({
      first_name : user.first_name,
      email : user.email,
      id : user._id
  });
  }).catch((err)=>{
    return res.status(400).json({
        message : "Something Went Wrong.",
        error : err 
    })
  })   
  
}





  exports.forget_password =  (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error : errors.array()
        })
    }
    guid = uuidv4();
  token = guid.replace(/-/g,""); 
  
    content =  { 
      password_reset_token: token
    }
    User.findOne({email: req.body.email}).then(function (user) {
     if (!user) {
        res.json({error:'User Not Found'});
     } else {
      User.findOneAndUpdate(
        {email: req.body.email},
        {$set : content},
        {new: true},
        async (err,data) =>  {
          if(err){
              return res.status(404).json({
                  error : err
              })
          
          } 

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
    User.findOne({password_reset_token: password_reset_token}).then(function (user) {
     if (!user) {
        res.json({error:'Token Expire or Incorrect'});
     } else { 
      content =  { 
        password: req.body.password,
        password_reset_token: ""
      }
      
      
        User.findOneAndUpdate(
          { password_reset_token: password_reset_token },
          {$set : content},
          {new: true},
          async (err,data) =>  {
              if(err){
                  return res.status(404).json({
                      error : err
                  })
              
              }
        
        res.send({message:'Password Changed Successfully.'});
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



  function forgetpassword_email(email,url) {
    const body = `<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width"> 
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting"> 
        <title></title> 
    
        <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet">
    </head>
    <style>
    
            html,
    
    h1,h2,h3,h4,h5,h6{
      font-family: 'Poppins', sans-serif;
      color: #000000;
      margin-top: 0;
      font-weight: 600;
    }
    
    </style>
    <body width="100%" style="font-family: 'Poppins', sans-serif;
      font-weight: 400;font-size: 16px;line-height: 1.8;color:#555555;margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
      <center style="width: 100%; background-color: #f1f1f1;">
        <div style="max-width: 100%; margin: 0 auto; background: #F7F9FD;" class="email-container">
          <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
            <tr>
              <td valign="top" style="padding: 1em 2.5em 0 2.5em;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td class="logo" style="text-align: center;">
                      <a href="#"><img src="https://udifyapi.pamsar.com/uploads/email/logo.png" width="200" height="50" alt="alt_text" border="0"/></a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          
            <tr>
              <td valign="middle" class="hero" style="padding: 2em 0 2em 0;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="text-align:left;">
                
                      <tr class="text-inner" background="https://udifyapi.pamsar.com/uploads/email/bg.png" style="border: none;max-width: 100%;
      margin: 0 auto; background-color:#fff;	padding: 2em;background-size: contain;">
      <td>
                <h1 style="text-align: center;">Reset Your Password</h1>
    <img src="https://udifyapi.pamsar.com/uploads/email/forgot.png" width="330px" height="auto" alt="" title="" style="float: left;margin-right: 10px;" />						
                        
                        <span class="name">Hi,</span>
    <p>To set up a new password to your Enmeldung account, click "Reset Your Password" below:</p>				           	
                         
                  
                  <p style="text-align: center;"><a href="${url}" style="padding: 10px 65px;display: inline-block;	border-radius: 120px;	background: #46BFA8;color: #ffffff;box-shadow: 4px 7px 6px #46BFA8; text-decoration:none;">Reset Password</a></p>
                  <p style="text-align: center;">If you didn’t request this, you can ignore this email or let us know. Your password won’t change untill you create a new password</p>
                  <td>
                       </tr>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="footer" align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
              
        <tr>
              <td class="" style="text-align: center; padding: 0 7%;">
              
    <p style="font-size:12px;">© Copyright 2022 Udify.io. All rights reserved.</p>
              </td>
            </tr>
          </table>
    
        </div>
      </center>
    </body>
    </html>`;
    return {
      to: email,
      from: process.env.SENDGRID_FROM_ADDRESS,
      subject: 'Password Reset',
      text: body,
      html: `${body}`,
    };
  }
  

exports.logout = (req,res) =>{
  const token = req.headers["x-access-token"];
  UserToken.deleteOne({token: token}).then(function(rowDeleted){
   
    if(rowDeleted.deletedCount==1){
    return  res.status(200).send({
        message:"Logout Successfully."
      });
    }
    if(rowDeleted.deletedCount==0){
      return res.status(200).send({
        message:"Not Found"
      });
    }
    
    return res.status(401).send({
        message:"Something Went Wrong"
      });
    
 }, function(err){
  return res.status(500).send({
    message:
      err.message || "Some error occurred."
  }); 
 });
}

