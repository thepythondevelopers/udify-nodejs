const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.account = require("./accounts.js")(sequelize, Sequelize);
db.setting = require("./setting.js")(sequelize, Sequelize);
db.integration = require("./integration.js")(sequelize, Sequelize);
db.user = require("./user.js")(sequelize, Sequelize);


//db.account.hasMany(db.setting);
//db.setting.belongsTo(db.account);
// db.integration.belongsTo(db.account);


module.exports = db;