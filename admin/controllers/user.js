const User = require("../../models/user");
const UserToken = require("../../models/userToken");
const Account = require("../../models/account");

require('dotenv').config();
var jwt = require('jsonwebtoken');
const moment= require('moment'); 

exports.getUsers = async (req,res) =>{
    const id = req.params.id;
    const search_string = req.body.search_string!=null ? req.body.search_string : "";
    const page = req.body.page!=null ? req.body.page : 1;
    
    limit = 10;
    const options = {
      page: page,
      limit: 10,
      collation: {
        locale: 'en',
      },
    };
    
    await User.paginate({access_group: { $ne: 'admin' },
            $or:[
        {'first_name': { $regex: '.*' + `${search_string}` + '.*' }},
        {'last_name': { $regex: '.*' + `${search_string}` + '.*' }},
        {'email': { $regex: '.*' + `${search_string}` + '.*' }},
        ]
    }, options, function (err, result) {
      return res.json(result);
    });

     
    }
  exports.getUser = (req,res) =>{
    const user_id = req.params.user_id;
    
    User.findOne({
            _id: user_id,
            access_group: { $ne: 'admin' }
    }).select('-password').populate('account_id')
    .exec(function(error, data) {
      if(error){
       return res.status(500).send({
          message: "Error while retrieving" || err 
        });
      }
        if (data) {
          return res.send(data);
        } else {
          return  res.status(404).send({
            message: `Cannot find User.`
          });
        }
    })
      
  }  
  
  exports.getUserToken = (req,res) =>{
    
    const user_id = req.params.user_id;
    
  User.findOne({
        _id: user_id,
        access_group: { $ne: 'admin' }
  }).then(async user => {
 if (!user) {
    res.json({error:'User Not Found'});
 } else {
  
    
        //create token
        
     
      var token = jwt.sign({ _id: user._id,email:user.email,access_group:user.access_group }, process.env.SECRET,{ expiresIn: '1d'  });
      
      user_token_data = {
        token : token 
      }
      await UserToken.create(user_token_data).then(function (user_token) {
        
      }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred."
        });
      });
      
      
      await UserToken.deleteOne({ createdAt:{$lte:moment().subtract(2, 'days').toDate()} });
      email = user.email;
      access_group = user.access_group;
      res.json({token,user:{email,access_group}});
    
  
}
}).catch(err => {
res.status(500).send({
  message:
    err.message || "Some error occurred."
});
});
  }

  exports.disableUser =async (req,res) =>{
    user_id = req.params.user_id;
    
    await User.findOneAndUpdate(
      {_id : user_id,access_group: { $ne: 'admin' }},
      {$set : {deleted_at: Date()}}
    );
    res.status(200).send({
      message:"User Disable"
    });
  }    

  exports.enableUser =async (req,res) =>{
    user_id = req.params.user_id;
    
    await User.findOneAndUpdate(
      {_id : user_id,access_group: { $ne: 'admin' }},
      {$set : {deleted_at: null}}
    );
    res.status(200).send({
      message:"User Enable"
    });
  }    