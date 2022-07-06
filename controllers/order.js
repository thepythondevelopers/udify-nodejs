const Shopify = require('shopify-api-node');
const db = require("../models");
const Integration = db.integration;

const Order = db.order;

const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
    


exports.getOrderAccordingtoStore = async (req,res) =>{
  
    try {  
    store_id =req.body.store_id!=null ? req.body.store_id : [];
    if(store_id==0){
      store_id = await Integration.findAll({
        attributes: ['store_id'],
        deleted_at: {
          [Op.is]: null, 
        },
        where: {account_id :req.body.account_id},
      })
      store_id = pluck(store_id, 'store_id');
    }
       
  const search_string = req.body.search_string!=null ? req.body.search_string : "";
  const page = req.body.page!=null ? req.body.page-1 : 0;

  if(req.body.startedDate!=null && req.body.endDate!=null ){
    
    const startedDate = new Date(req.body.startedDate);
    const endDate = new Date(req.body.endDate);
    endDate.setDate(endDate.getDate() + 1);
  
    result = await Order.findAndCountAll({
      where: {store_id : {
        [Op.in]: store_id  
      },  [Op.or]: [
        { name: { [Op.like]: `%${search_string}%` } },
        { total: { [Op.like]: `%${search_string}%` } },
        { subtotal: { [Op.like]: `%${search_string}%` } },
        
      ],
      
          created_at: {
         [Op.between]: [startedDate, endDate]
     }
    
    },
    limit: 10,
    offset: page
    })
  }else{
    result = await Order.findAndCountAll({
      where: {store_id : {
        [Op.in]: store_id  
      },  [Op.or]: [
        { name: { [Op.like]: `%${search_string}%` } },
        { total: { [Op.like]: `%${search_string}%` } },
        { subtotal: { [Op.like]: `%${search_string}%` } },
      ],
      
    },
    limit: 10,
    offset: page
    })
  } 
    return res.json({data:result});
  }  catch (err) {
      return res.status(401).send({
        message : "Something Went Wrong",
        error :err
      });
    }
  }

  exports.getSingleOrder = async (req,res) =>{
    const id = req.params.order_id;
    result = await Order.findOne({
      where: {guid : id}
    })
    return res.json({data:result});
  }