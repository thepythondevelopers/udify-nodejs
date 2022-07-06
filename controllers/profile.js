const db = require("../models");
const User = db.user;
const Account = db.account;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

var fs = require('fs');

exports.updateUserProfile1 = async (req,res)=>{
  
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