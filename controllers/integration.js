const { v4: uuidv4 } = require('uuid');
const db = require("../models");
const Integration = db.integration;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");
const Shopify = require('shopify-api-node');
 

exports.createIntegration = async (req,res) =>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
  const shopify = new Shopify({
    shopName: req.body.domain,
    accessToken: req.body.access_token
  });
  let params = { limit: 1 };
            const products = await shopify.product.list(params).then( async data => {
 guid = uuidv4();
  guid = guid.replace(/-/g,""); 
  req.body.guid = guid;

  store_id = uuidv4();
  store_id = store_id.replace(/-/g,"");
  req.body.store_id = store_id;
    

     await Integration
      .create(req.body)
      .then(integration => {
        return res.json(integration);
      }).catch((err)=>{
        return res.status(400).json({
            message : "Unable to sabe in db",
            error : err 
        })
      })  
            }).catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while Syncing."
              });
            });
   
}

exports.findIntegration = (req,res) =>{
    const id = req.params.id;
    Integration.findOne({
      where: {
        guid: id,
        account_id :req.body.account_id,
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
            message: `Cannot find Integration with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Integration with id=" + id
        });
      });
  }
  
  exports.findAllIntegration = (req, res) => {
    account_id = req.body.account_id;
    Integration.findAll({ 
      attributes: {exclude: ['access_token','store_api_key','store_api_secret']},
      where: {
        account_id :req.body.account_id,
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
            err.message || "Some error occurred while retrieving Integration."
        });
      });
  };

exports.updateIntegration = (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
  const id = req.params.id;
  content =  { store_api_key: req.body.store_api_key, 
    store_api_secret: req.body.store_api_secret,
    domain: req.body.domain,
    access_token: req.body.access_token
  }
  

  Integration.update(
    content,
    { where: { guid: id ,account_id :req.body.account_id},
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

exports.deleteIntegration = (req,res)=>{
  const id = req.params.id;
  const account_id = req.body.account_id;
  Integration.update(
    {deleted_at : Date.now()},
    { where: { guid: id ,account_id :account_id} }
  )
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while deleting Integration."
    });
  });   
}