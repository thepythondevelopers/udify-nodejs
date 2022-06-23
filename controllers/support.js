const db = require("../models");
const Support = db.support;
const User = db.user;
const Account = db.account;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const { v4: uuidv4 } = require('uuid');

exports.createSupport = async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
  guid = uuidv4();
  guid = guid.replace(/-/g,""); 
  content =  {  
    id : guid,
    user_id : req.user.id,
    parent_id : 0,
    message : req.body.message,
    user_read : 1,
    admin_read : 1
  }
  
  await Support
      .create(content)
  .then(data => {
    res.send({message:"Support Ticket Generated Successfully"});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while saving."
    });
  });   
}

exports.replyTicketSupport = async (req,res)=>{
  parent_id = req.params.parent_id;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
  guid = uuidv4();
  guid = guid.replace(/-/g,""); 
  content =  {  
    id : guid,
    user_id : req.user.id,
    parent_id : req.body.parent_id,
    message : req.body.message,
    user_read : 1,
    admin_read : 1
  }
  
  await Support
      .create(content)
  .then(data => {
    res.send({message:"Support Ticket Reply Successfully"});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while saving."
    });
  });   
}



exports.getTicket = (req, res) => {
  Support.findOne({ where: {
      id : req.params.id
  },
  include: [{
    model: Support,
    as: 'reply',
    include: [{
      model: User,
    attributes: [ 'first_name', 'last_name', 'email']
    },
    {
      model: Account,
      attributes: [ 'avatar']
    }
  ]
    
  },
  {
    model: User,
    attributes: [ 'first_name', 'last_name', 'email']
},
{
  model: Account,
  attributes: [ 'avatar']
}
],
   })
    .then(data => {
      
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving."
      });
    });
};


exports.getAllTicket = (req,res)=>{
  Support.findAll({ where: {
    user_id : req.user.id
    },
    include: [
    {
      model: User,
      attributes: [ 'first_name', 'last_name', 'email']
  },
  {
    model: Account,
    attributes: [ 'avatar']
  }
  ]
 })
  .then(data => {   
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  }); 
}

exports.getAllTicketAdmin = (req,res)=>{
  Support.findAll({
    include: [
      {
        model: User,
        attributes: [ 'first_name', 'last_name', 'email']
    },
    {
      model: Account,
      attributes: [ 'avatar']
    }
    ]
  })
  .then(data => {   
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  }); 
}

exports.getTicketNotificationAdmin = (req,res)=>{
  Support.findAll({where:{
    admin_read : 1
  }})
  .then(data => {   
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  }); 
}

exports.getTicketNotificationUser = (req,res)=>{
  Support.findAll({where:{
    user_read : 1
  }})
  .then(data => {   
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving."
    });
  }); 
}


exports.readNotificationAdmin = (req,res)=>{
  const id = req.params.id;
  Support.update(
    {admin_read : 0},
    { where: { id: req.params.id } }
  )
  .then(data => {
    res.send({message : "Notification Read"});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating Integration."
    });
  });   
}

exports.readNotificationUser = (req,res)=>{
  const id = req.params.id;
  Support.update(
    {user_read : 0},
    { where: { id: req.params.id, user_id:req.user.id } }
  )
  .then(data => {
    res.send({message : "Notification Read"});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating Integration."
    });
  });   
}