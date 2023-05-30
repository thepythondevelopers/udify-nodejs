const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const KnowledgebaseSchema = new Schema({
      title: {
        type: String,
        required : true
      },
      category: {
        type: String,
        required : true
      },
      description: {
        type: String,
        required : true
      } 
    } ,{timestamps: true});

module.exports = mongoose.model("Knowledgebase",KnowledgebaseSchema);