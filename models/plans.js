module.exports = (sequelize, Sequelize) => {
    const Plan = sequelize.define("plans", {
      id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      app_id: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      price_id: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      features: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
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
    return Plan;
  };