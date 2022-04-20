module.exports = (sequelize, Sequelize) => {
  const Setting = sequelize.define("settings", {
    guid : {
        type: Sequelize.CHAR(32),
      primaryKey: true,
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
    }, account_id: {
      type: Sequelize.UUID,
      references: {
          model: 'accounts',
          key: 'guid'
      }
  } 
    
  },{
    timestamps: false
});
  return Setting;
};