const db = require("../models");
const Account = db.account;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");



exports.findAccount = (req,res) =>{
  const id = req.params.id;
  Account.findOne({
    where: {
      guid: id,
      deleted_at: {
        [Op.is]: null, 
      } 
    },
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
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
}

exports.findAllAccount = (req, res) => {
  Account.findAll({ where: {
    deleted_at: {
      [Op.is]: null, 
    }}
   })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving account."
      });
    });
};


exports.updateAccount = (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
  const id = req.params.id;
  content =  { name: req.body.name, 
    api_token: req.body.api_token,
    public_id: req.body.public_id,
    address_street: req.body.address_street,
    address_unit: req.body.address_unit,
    address_city: req.body.address_city, 
    address_state: req.body.address_state,
    address_zip: req.body.address_zip,
    address_country: req.body.address_country,
    stripe_customer_id: req.body.stripe_customer_id       
  }
  
  Account.update(
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
        err.message || "Some error occurred while updating Integration."
    });
  });   
}

exports.deleteAccount = (req,res)=>{
  const id = req.params.id;
  Account.update(
    {deleted_at : Date.now()},
    { where: { guid: id } }
  )
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating Integration."
    });
  });   
}