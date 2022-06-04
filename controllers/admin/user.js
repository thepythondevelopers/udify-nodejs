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
    User.findOne({
        attributes: {exclude: ['password']},
        where: {        
            guid: user_id,
            access_group: {[Op.not]:'admin'},
        
        // deleted_at: {
        //   [Op.is]: null, 
        // } 
      },
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
  
  