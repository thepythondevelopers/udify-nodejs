const db = require("../../models");
const User = db.user;
const Account = db.account;
const UserToken = db.userToken;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require('stripe')(process.env.STRIPE_KEY);
var fs = require('fs');
var jwt = require('jsonwebtoken');
const moment= require('moment'); 

exports.getUsers = (req,res) =>{
    const id = req.params.id;
    User.findAll({
      where: {
        
        access_group: {[Op.not]:'admin'},
        // deleted_at: {
        //   [Op.is]: null, 
        // } 
      },
    })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error while retrieving" || err 
        });
      });
  }

  exports.getUser = (req,res) =>{
    const user_id = req.params.user_id;
    const search_string = req.body.search_string!=null ? req.body.search_string : "";
    User.findOne({
        attributes: {exclude: ['password']},
        where: {        
            guid: user_id,
            access_group: {[Op.not]:'admin'},
        
        // deleted_at: {
        //   [Op.is]: null, 
        // } 
      },
      [Op.or]: [
        { first_name: { [Op.like]: `%${search_string}%` } },
        { last_name: { [Op.like]: `%${search_string}%` } },
        { email: { [Op.like]: `%${search_string}%` } },
        { phone: { [Op.like]: `%${search_string}%` } },
      ],
      include: [{
        model: Account
        }]       
    })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error while retrieving" || err 
        });
      });
  }  
  
  exports.getUserToken = (req,res) =>{
    
    const user_id = req.params.user_id;
    
  User.findOne({
    where: {
        guid: user_id,
        access_group: {[Op.not]:'admin'}
           }
  }).then(async user => {
 if (!user) {
    res.json({error:'User Not Found'});
 } else {
  
    
        //create token
        
      var token = jwt.sign({ id: user.guid, access_group: user.access_group }, process.env.SECRET,{ expiresIn: '1d'  });
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
    
  
}
}).catch(err => {
res.status(500).send({
  message:
    err.message || "Some error occurred."
});
});
  }

  exports.disableUser =async (req,res) =>{
    user_id = req.params.user_id;
    
    await User.update(
      {deleted_at: Date()},
      { where: { guid: user_id },
      access_group: {[Op.not]:'admin'}
     }
    );
    res.status(200).send({
      message:"User Disable"
    });
  }    

  exports.enableUser =async (req,res) =>{
    user_id = req.params.user_id;
    
    await User.update(
      {deleted_at: null},
      { where: { guid: user_id },
      access_group: {[Op.not]:'admin'}
     }
    );
    res.status(200).send({
      message:"User Enable"
    });
  }    