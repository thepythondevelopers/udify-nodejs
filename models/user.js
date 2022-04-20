const bcrypt = require("bcrypt");
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
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
        type: Sequelize.DATE
      },
      account_id:{
        type: Sequelize.UUID,
      references: {
          model: 'accounts',
          key: 'guid'
      }
      },
      first_name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
    last_name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone:{
        type: Sequelize.STRING(45),
        allowNull: true,
    },
    password:{
        type: Sequelize.TEXT,
        set(value) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hash);
        },
    },
    access_group:{
        type: Sequelize.ENUM('retailer','supplier','admin','owner','user'),
        defaultValue: 'user'
    },
    server_admin:{
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 0
    },
    password_reset_token:{
        type: Sequelize.CHAR(32),
        allowNull: true,
    },
    daily_reports:{
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 0
    },
    monthly_reports:{
        type: Sequelize.TINYINT(1),
        allowNull: true,
        defaultValue: 0
    },
    notification_email_list:{
        type: Sequelize.STRING(1024),
        allowNull: true,
    },
    onboarding:{
        type: Sequelize.INTEGER(1),
        allowNull: true,
        defaultValue: 0
    },
    plan_status:{
        type: Sequelize.ENUM('trial','basic','pro','enterprise'),
        defaultValue: 'trial'
    } 
      
    },{
      timestamps: false
  });

  
  



    return User;
  };
  