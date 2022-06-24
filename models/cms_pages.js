module.exports = (sequelize, Sequelize) => {
    const CmsPage = sequelize.define("cms_pages", {
      id : {
          type: Sequelize.CHAR(32),
          primaryKey: true,
      },
      type :{
        allowNull: false,
        type: Sequelize.STRING()
      },
      data :{
        allowNull: false,
        type: Sequelize.TEXT('long'),
        set(value) {
            const data = JSON.stringify(value);
            this.setDataValue('data', data);
          },
          get() {
            string_data = this.getDataValue('data');
            return JSON.parse(string_data);
          }
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
      }
      
    },{
        timestamps: false
    });
    return CmsPage;
  };