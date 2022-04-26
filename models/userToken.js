
module.exports = (sequelize, Sequelize) => {
    const UserToken = sequelize.define("user_tokens", {
      id : {
          type: Sequelize.CHAR(32),
        primaryKey: true,
      },
      token: {
        type: Sequelize.TEXT(),
        required : true,
        allowNull: false,
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
    },{
      timestamps: false
  });
    return UserToken;
  };

	
	
	
