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
        trim: true
      },
      api_token:{
        type: Sequelize.CHAR(32)
      },
      public_id:{
        type: Sequelize.CHAR(32),
        required : true,
        allowNull: false,
    },
	address_street:{
        type: Sequelize.STRING
    },
	address_unit:{
        type: Sequelize.STRING
    },
	address_city:{
        type: Sequelize.STRING,
    },
	address_state:{
        type: Sequelize.CHAR(2)
    },
	address_zip:{
        type: Sequelize.STRING
    },
	address_country:{
        type: Sequelize.CHAR(2),
        defaultValue: 'US'
    },
	stripe_customer_id:{
        type: Sequelize.STRING(80),
    },
    location:{
      type: Sequelize.STRING()
    },
    website:{
      type: Sequelize.STRING()
    },
    about:{
      type: Sequelize.TEXT()
    },
    avatar:{
      type: Sequelize.STRING()
    },
    company:{
      type: Sequelize.STRING()
    }
      
    },{
        timestamps: false
    });
    return Account;
  };