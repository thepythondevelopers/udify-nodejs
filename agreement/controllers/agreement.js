const User = require("../../models/user");
const Agreement = require("../../models/agreement");
const {validationResult} = require("express-validator");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.aggreement = async (req,res) =>{
  

  aggreement = await Agreement.findOne({user : req.user._id,supplier : req.params.supplier});
  if(aggreement!=null){
    return res.status(201).json({message : 'Already have aggrement'}); 
  }
      
    data = {
        user : req.user._id,
        supplier : req.params.supplier
    }  
    
    aggre =new Agreement(data);
    aggre.save((err,aggre)=>{
        if(err){
            return res.status(400).json({
                message : err
            })
        }
        return res.status(200).json({message : 'Aggreement made successfully.'}); 
    })          
      
}

exports.checkAggreement = async (req,res) =>{
  aggreement = await Agreement.findOne({user : req.user._id,supplier : req.params.supplier});
  return res.json(aggreement);   
}