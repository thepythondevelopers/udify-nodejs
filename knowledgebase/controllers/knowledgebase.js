const Knowledgebase = require("../../models/knowledgebase");
const {validationResult} = require("express-validator");

exports.createBase =  (req,res)=>{
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
exports.updateBase = async (req,res)=>{
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
  
  await Knowledgebase.findOneAndUpdate(
    {_id : id},
    {$set : data},
    {new: true},
    (err,base) => {
        if(err){
            return res.status(404).json({
                error : err
            })      
        }

        if(base===null){
            return res.status(404).json({
                message : "No Data Found"
            })
        }

        return res.json({message : "Update Successfully."});
    }
    )

}  

exports.getBase = (req,res)=>{
    
  Knowledgebase.find().then(data => {
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
   Knowledgebase.deleteOne({_id: id }).then(data => {
      res.json({message : "Delete Successfully."});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting Plan."
      });
    });
}

exports.getBaseById = (req, res) => {
  Knowledgebase.findOne({_id : req.params.id})
    .then(data => {
      if(data===null){
        res.json({message:"No Data Found."})
      }else{
        res.send(data);
      }
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving."
      });
    });
};