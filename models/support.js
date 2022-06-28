
module.exports = (sequelize, Sequelize) => {
    const supportToken = sequelize.define("supports", {
      id : {
          type: Sequelize.CHAR(32),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.CHAR(32),
        
      },
      parent_id :{
        type: Sequelize.CHAR(32),
        required : true,
        allowNull: false  
      },
      name: {
        type: Sequelize.STRING()
      },
      subject: {
        type: Sequelize.STRING(),
      },
      email: {
        type: Sequelize.STRING(),
      },
      message:{
        type: Sequelize.TEXT(),
        required : true,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(),
        allowNull: false,
        defaultValue: 'New'
      },
      file: {
        type: Sequelize.TEXT('long')
      },
      admin_read:{
        type: Sequelize.INTEGER(),
        required : true,
        allowNull: false
      },
      user_read:{
        type: Sequelize.INTEGER(),
        required : true,
        allowNull: false
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
    return supportToken;
  };

	
	
	
