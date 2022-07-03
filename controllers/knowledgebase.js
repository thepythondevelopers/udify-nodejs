const db = require("../models");
const Knowledgebase = db.knowledgebase;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");

const { v4: uuidv4 } = require('uuid');

exports.createBase =  (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }  
  guid  = uuidv4();
  guid  = guid.replace(/-/g,"");

  data = {
    id : guid,
    title : req.body.title,
    category : req.body.category,
    description : req.body.description
  }
  Knowledgebase.create(data)
  .then(base => {
    return res.json({message : "Save Successfully."});
  }).catch((err)=>{
    return res.status(400).json({
        message : "Unable to sabe in db",
        error : err 
    })
  })
  
}
exports.updateBase = (req,res)=>{
  const id = req.params.id;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }  
  
   
  data = {
    title : req.body.title,
    category : req.body.category,
    description : req.body.description
  }
  
  Knowledgebase.update(
    data,
    { where: { id: id}
   }
  )
  .then(base => {
    return res.json({message : "Update Successfully."});
  }).catch((err)=>{
    return res.status(400).json({
        message : "Unable to sabe in db",
        error : err 
    })
  })

}  

exports.getBase = (req,res)=>{
    
  Knowledgebase.findAll().then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while getting."
        });
      });
}

exports.destroyBase = (req,res)=>{
   id =req.params.id; 
   Knowledgebase.destroy({
    where: { id: id },
  }).then(data => {
      res.json({message : "Delete Successfully."});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting Plan."
      });
    });
}

