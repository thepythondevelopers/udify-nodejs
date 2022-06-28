const db = require("../models");
const User = db.user;
const Account = db.account;
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
const moment= require('moment') 
// var expressJwt = require('express-jwt');
var fs = require('fs');
exports.signup =  (req,res)=>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({
          error : errors.array()
      })
  }

  
  guid = uuidv4();
  guid = guid.replace(/-/g,""); 
  req.body.guid = guid;

  account_id  = uuidv4();
  account_id  = account_id.replace(/-/g,""); 
  req.body.account_id  = account_id ;
 
  api_token  = uuidv4();
  api_token  = api_token.replace(/-/g,""); 
  
  user_data = {
    guid : req.body.guid,
    first_name: req.body.first_name,
    last_name : req.body.last_name,
    password : req.body.password,
    email: req.body.email,
    notification_email_list:req.body.notification_email_list,
    account_id : req.body.account_id 
  }

  
  User.create(user_data)
  .then(async user => {
    
    const stripe_customer = await stripe.customers.create({
      email: req.body.email,
    });
  
    
    
    account_data = {
      guid : req.body.account_id,
      name : req.body.first_name,
      api_token : api_token,
      public_id : user.guid,
      stripe_customer_id : stripe_customer.id
    }
    await Account.create(account_data); 

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
  if(req.body.role=='admin'){
    userquery = User.findOne({
      where: {
          email: req.body.email,
          access_group:"admin"
             }
    })  
  }else{
    userquery = User.findOne({
      where: {
          email: req.body.email,
          deleted_at: {
            [Op.is]: null, 
          },
          access_group: {[Op.not]:'admin'}
             }
    })
  }
  userquery.then(function (user) {
   if (!user) {
      res.json({error:'User Not Found'});
   } else {
    bcrypt.compare(req.body.password, user.password, async function (err, result) {
      if (result == true) {
          //create token
          
        var token = jwt.sign({ id: user.guid, access_group: user.access_group,email:user.email }, process.env.SECRET,{ expiresIn: '1d'  });
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
              err.message || "Some error occurred."
          });
        });
        
        
        await UserToken.destroy({
          where: {
            created_at: {
              [Op.lte]: moment().subtract(2, 'days').toDate()
            }
          }
        })
        email = user.email;
        access_group = user.access_group;
        res.json({token,user:{email,access_group}});
      } else {
        res.json({error:"Incorrect Password"});
      }
    });
  }
}).catch(err => {
  res.status(500).send({
    message:
      err.message || "Some error occurred."
  });
});
}


exports.updateUserProfile1 = async (req,res)=>{
  
  
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(400).json({
    //         error : errors.array()
    //     })
    // }
    const id = req.user.id;
    
    if(req.file){
      avatar =req.file.filename;
        content =  { 
          avatar: avatar, 
          location: req.body.location,
          website: req.body.website,
          about: req.body.about
      }
    }else{
        content =  {       
          location: req.body.location,
          website: req.body.website,
          about: req.body.about
      }
    }
    
    account_find = await Account.findOne(
      { where: { public_id: id },
      deleted_at: {
        [Op.is]: null, 
      }
     }
    );
    
    if(account_find !=null){
      if(req.file){
      //fs.unlink(account_find.avatar);
    if (fs.existsSync('./uploads/avatar/'+account_find.avatar)) {
    fs.unlink('./uploads/avatar/'+account_find.avatar, function (err) {
    //  if (err) console.log(err);
	
	console.log('File deleted!');
});
    }
    }
  }   
    Account.update(
      content,
      { where: { public_id: id },
      deleted_at: {
        [Op.is]: null, 
      }
     }
    )
    .then(data => {
      res.send({message:'Successfully Updated'});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating User Profile."
      });
    });   
  }


  exports.updateUserProfile2 = async (req,res)=>{
  
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error : errors.array()
        })
    }
    const id = req.user.id;
   
    account_content =  { 
      company : req.body.company,
      name : req.body.name,
      address_street  : req.body.address_street,
      address_city : req.body.address_city,
      address_state : req.body.address_state,
      address_zip : req.body.address_zip,
      address_country : req.body.address_country
    }

    user_content = {
      first_name : req.body.first_name,
      last_name : req.body.last_name
    }
try{
    await Account.update(
      account_content,
      { where: { public_id: id },
      deleted_at: {
        [Op.is]: null, 
      }
     }
    )

    await User.update(
      user_content,
      { where: { guid: id },
      deleted_at: {
        [Op.is]: null, 
      }
     }
    )
    res.send({message:'Successfully Updated'});
  }catch (error) {
            res.status(500).send({
              message: error
            });
  }    
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
    User.findOne({
      where: {
          email: req.body.email
             }
    }).then(function (user) {
     if (!user) {
        res.json({error:'User Not Found'});
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
        res.json({error:'Token Expire or Incorrect'});
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

  exports.get_profile = (req,res)=>{

    User.findOne({
      attributes: {exclude: ['password']},
      where: {guid: req.user.id},
      include: [{
              model: Account
      }]       
    }).then(function (user) {
     if (!user) {
        res.json({error:'User Not Found.'});
     } else {
       
      if(user.account.avatar!==""){
      user.account.avatar = 'https://udifyapi.pamsar.com/uploads/avatar/'+user.account.avatar
      }
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

