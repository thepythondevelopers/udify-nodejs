module.exports = (sequelize, Sequelize) => {
    const ProductCustomData = sequelize.define("products_custom_data", {
      guid : {
          type: Sequelize.CHAR(32),
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.CHAR(32),
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING(40)
      },
      value: {
        type: Sequelize.STRING
      },     
      created_at :{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      } 
      
    },{
      timestamps: false
  });
    return ProductCustomData;
  };
