const Shopify = require('shopify-api-node');
const db = require("../models");
const Integration = db.integration;

const Order = db.order;

const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
exports.syncOrder =  (req,res) =>{
    //page_info = req.body.page_info;
    const id = req.params.integration_id;
    Integration.findByPk(id)
      .then( async data => {
        if (data) {
          const shopify = new Shopify({
            shopName: data.domain,
            accessToken: data.access_token
          });
            

          order_data = await shopify.order.list();
          const store_id = data.store_id;
          Order.destroy({
            where: {
                store_id : store_id
            }
        })
          await Promise.all(order_data.map(async (element) => {
            product_ids = [];
            variant_ids = [];
            Promise.all(element.line_items.map(async (line_item) => {
                product_ids.push(line_item.product_id);
                variant_ids.push(line_item.variant_id);
            }));
            guid = uuidv4();
              guid = guid.replace(/-/g,"");
              
            order_content = {
                guid : guid,
                store_id : store_id,
                created_at : element.created_at,
                updated_at : element.updated_at,
                subtotal : element.subtotal_price,
                total : element.total_price,
                closed_at : element.closed_at,
                shopify_order_id : element.id,
                note : element.note,
                token :element.token,
                gateway : element.gateway,
                total_weight : element.total_weight,
                total_tax : element.total_tax,
                taxes_included : element.taxes_included,
                currency : element.currency,
                financial_status : element.financial_status,
                confirmed : element.confirmed,
                total_discounts : element.total_discounts,
                total_line_items_price : element.total_line_items_price,
                cart_token : element.cart_token,
                name : element.name,
                cancelled_at : element.cancelled_at,
                cancel_reason : element.cancel_reason,
                total_price_usd : element.total_price_usd,
                checkout_token : element.checkout_token,
                processed_at : element.processed_at,
                device_id : element.device_id,
                app_id : element.app_id,
                browser_ip : element.browser_ip,
                fulfillment_status : element.fulfillment_status,
                order_status_url : element.order_status_url,
                customer_id : element.customer.id,
                variant_ids : JSON.stringify(variant_ids),
                product_ids: JSON.stringify(product_ids)
            }	


            Order.create(order_content);

        }));
        return res.json(
            {message:"Order Synced Successfully"});
        }
    }) .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Syncing."
        });
      });   
}     


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
  if(req.body.startedDate!=null && req.body.endDate!=null ){
    
    const startedDate = new Date(req.body.startedDate);
    const endDate = new Date(req.body.endDate);
    endDate.setDate(endDate.getDate() + 1);
  
  
    result = await Order.findAll({
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
    
    }
    })
  }else{
    result = await Order.findAll({
      where: {store_id : {
        [Op.in]: store_id  
      },  [Op.or]: [
        { name: { [Op.like]: `%${search_string}%` } },
        { total: { [Op.like]: `%${search_string}%` } },
        { subtotal: { [Op.like]: `%${search_string}%` } },
      ],
      
    }
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