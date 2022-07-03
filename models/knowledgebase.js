
module.exports = (sequelize, Sequelize) => {
    const Knowledgebase = sequelize.define("knowledgebases", {
      id : {
          type: Sequelize.CHAR(32),
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(),
        required : true,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(),
        required : true,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT('long'),
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
    return Knowledgebase;
  };

	
	
	
