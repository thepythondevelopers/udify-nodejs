module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("accounts", {
      guid : {
          type: Sequelize.CHAR(32),
          primaryKey: true,
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
      deleted_at:{
        type: Sequelize.DATE,
      },
      name:{
        type: Sequelize.STRING,
        required: true,
        trim: true,
        required : true,
        allowNull: false,
      },
      api_token:{
        type: Sequelize.CHAR(32),
        required : true,
        allowNull: false,
      },
      public_id:{
        type: Sequelize.CHAR(32),
        required : true,
        allowNull: false,
    },
	address_street:{
        type: Sequelize.STRING,
        required : true,
        allowNull: false,
    },
	address_unit:{
        type: Sequelize.STRING,
        required : true,
        allowNull: false,
    },
	address_city:{
        type: Sequelize.STRING,
        required : true,
        allowNull: false,
    },
	address_state:{
        type: Sequelize.CHAR(2),
        required : true,
        allowNull: false,
    },
	address_zip:{
        type: Sequelize.STRING,
        required : true,
        allowNull: false,
    },
	address_country:{
        type: Sequelize.CHAR(2),
        defaultValue: 'US'
    },
	stripe_customer_id:{
        type: Sequelize.STRING(80),
    }
      
    },{
        timestamps: false
    });
    return Account;
  };