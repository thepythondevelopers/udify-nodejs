module.exports = (sequelize, Sequelize) => {
    const ProductVariant = sequelize.define("product_variants", {
      guid : {
          type: Sequelize.CHAR(32),
        primaryKey: true,
      },
      store_id:{
        type: Sequelize.CHAR(32),
        allowNull: false,
      },
      product_id:{
        type: Sequelize.CHAR(32),
      },
      barcode:{
        type: Sequelize.STRING(50)
      },
      compare_at_price:{
        type: Sequelize.STRING(20)
      },
      created_at:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      fulfillment_service:{
        type: Sequelize.STRING(20)
      },
      grams:{
        type: Sequelize.INTEGER()
      },
      weight:{
        type: Sequelize.FLOAT()
      },
      weight_unit:{
        type: Sequelize.STRING(10)
      },
      id:{
        type: Sequelize.STRING(30)
      },
      inventory_item_id:{
        type: Sequelize.STRING(30)
      },
      inventory_management:{
        type: Sequelize.STRING(20)
      },
      inventory_policy:{
        type: Sequelize.STRING(40)
      },
      inventory_quantity:{
        type: Sequelize.INTEGER()
      },
      option1:{
        type: Sequelize.STRING()
      },
      option2:{
        type: Sequelize.STRING()
      },
      option3:{
        type: Sequelize.STRING()
      },
      position:{
        type: Sequelize.INTEGER()
      },
      price:{
        type: Sequelize.STRING(20)
      },
      presentment_prices:{
        type: Sequelize.TEXT()
      },
      shopify_product_id:{
        type: Sequelize.STRING(30)
      },
      requires_shipping:{
        type: Sequelize.BOOLEAN()
      },
      sku:{
        type: Sequelize.STRING(30)
      },
      taxable:{
        type: Sequelize.BOOLEAN()
      },
      title:{
        type: Sequelize.STRING()
      },
      updated_at:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      image_id:{
        type: Sequelize.STRING(30)
      },
      sys_updated_at:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      } 
      
    },{
      timestamps: false,
  });
    return ProductVariant;
  };

