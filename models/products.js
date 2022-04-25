module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
      guid : {
          type: Sequelize.CHAR(32),
        primaryKey: true,
      },
      store_id : {
        type: Sequelize.CHAR(32),
        allowNull: false,
    },
    body_html: {
        type: Sequelize.TEXT()
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
      }, 
      handle: {
        type: Sequelize.STRING(),
    },
    id :{
        type: Sequelize.CHAR(30),
        allowNull: false,
    },
    images:{
        type: Sequelize.TEXT()
    },
    options:{
        type: Sequelize.TEXT()
    },
    product_type:{
        type: Sequelize.STRING(),
    },
    published_at:{        
        type: Sequelize.DATE,
    },
    published_scope:{
        type: Sequelize.CHAR(6)
    },
    tags:{
        type: Sequelize.TEXT()
    },
    template_suffix:{
        type: Sequelize.CHAR(50)
    },
    title:{
        type: Sequelize.STRING(),
    },
    metafields_global_title_tag:{
        type: Sequelize.STRING(),
    },
    metafields_global_description_tag:{
        type: Sequelize.STRING(),
    },
    vendor:{
        type: Sequelize.STRING(),
    },
    sys_updated_at:{
        type: Sequelize.DATE,
    }
      
    },{
      timestamps: false
  });
    return Product;
  };
