module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("customers", {
      guid : {
        type: Sequelize.CHAR(32),
        primaryKey: true,
      },
      store_id: {
        allowNull: false,
        type: Sequelize.CHAR(32),
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(45)
      },
      last_name: {
        type: Sequelize.STRING(45)
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
      accepts_marketing:{
        type: Sequelize.BOOLEAN()
      },
     email:{
        allowNull: false,
        type: Sequelize.STRING(80)
     },
    orders_count:{
        type: Sequelize.INTEGER()
    },
    total_spent:{
        type: Sequelize.INTEGER()
    },
    tax_exempt:{
        type: Sequelize.BOOLEAN(),
        defaultValue: 0
    },
    shopify_id:{
        type: Sequelize.STRING(20)
    },
    company:{
        type: Sequelize.STRING(120)
    },
    address_line1:{ 
        type: Sequelize.STRING()
    },
    address_line2:{
        type: Sequelize.STRING()
    },
    city:{
        type: Sequelize.STRING(60)
    },
    province:{
        type: Sequelize.STRING(60)
    },
    country:{
        type: Sequelize.STRING(120)
    },
    zip:{
        type: Sequelize.STRING(20)
    },
    phone:{
        type: Sequelize.STRING(20)
    },
    province_code:{
        type: Sequelize.STRING(5)
    },
    country_code:{
        type: Sequelize.STRING(5)
    },
    country_name:{
        type: Sequelize.STRING(50)
    },
    default:{
        type: Sequelize.BOOLEAN()
    },
    sys_updated_at:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
    } 

    },{
      timestamps: false
  });
    return Customer;
  };