
const db = require("../models");
const Plan = db.plan;
const Op = db.Sequelize.Op;
const {validationResult} = require("express-validator");




exports.getPlan = (req,res)=>{
    
    Plan.findAll().then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while getting Plan."
        });
      });
}