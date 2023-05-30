const User = require("../../models/user");
const productGallery = require("../../models/vendorProductGallery");

exports.createImage =  async (req,res) =>{
  User.findOne({_id:req.user._id}).then((data)=>{
    if(data){
      console.log(data);
      productGallery.findOne({supplier_id:req.user._id}).then(async (data2)=>{
        if(data2){
          console.log("working1",req.user._id);
          for(var i=0;i<req.files.length;i++){
            var filename = req.files[i].filename;
            console.log(filename);
            await productGallery.updateOne(
              {supplier_id:req.user._id},
              {$push : {prod_img:filename}}
            )
          }
        }
        else{
          for(var i=0;i<req.files.length;i++){
            var filename = req.files[i].filename;
            if(i===0){
              await productGallery.create(
                {
                  supplier_id:req.user._id,
                  prod_img:[filename]
                }
              )
            }
            else{
              console.log("working",req.user._id);
              await productGallery.updateOne(
                {supplier_id:req.user._id},
                {$push : {prod_img:filename}}
              )
            }
          }
        }
      })
      return res.status(200).send({"msg":"Images inserted successfully"});
    }
    else{
      return res.status(400).send({"msg":"No such user found"});
    }
  })
}    


exports.getImages = async(req,res)=>{
  await productGallery.findOne({supplier_id:req.user._id}).select("prod_img").then((data)=>{
    if(data){
      return res.status(200).send(data);
    }
    else{
      return res.status(400).send({"msg":"Empty Gallery"});
    }
  })
}