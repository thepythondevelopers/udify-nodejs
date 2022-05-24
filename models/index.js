const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  
  // pool: {
  //   connectionLimit : 100, //important
  //   max: dbConfig.pool.max,
  //   min: dbConfig.pool.min,
  //   acquire: dbConfig.pool.acquire,
  //   idle: dbConfig.pool.idle
  // }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.stripeSubscription = require("./stripe_subscriptions.js")(sequelize, Sequelize);
db.plan = require("./plans.js")(sequelize, Sequelize);
db.order = require("./order.js")(sequelize, Sequelize);
db.customer = require("./customer.js")(sequelize, Sequelize);
db.userToken = require("./userToken.js")(sequelize, Sequelize);
db.product = require("./products.js")(sequelize, Sequelize);
db.productCustomData = require("./products_custom_data.js")(sequelize, Sequelize);
db.productVariant = require("./product_variants.js")(sequelize, Sequelize);
db.account = require("./accounts.js")(sequelize, Sequelize);
db.setting = require("./setting.js")(sequelize, Sequelize);
db.integration = require("./integration.js")(sequelize, Sequelize);
db.user = require("./user.js")(sequelize, Sequelize);

db.product.hasMany(db.productVariant,{ foreignKey: 'product_id', sourceKey: 'id'});
db.user.hasOne(db.account,{ foreignKey: 'public_id', sourceKey: 'guid'});
//db.account.hasMany(db.setting);
//db.setting.belongsTo(db.account);
// db.integration.belongsTo(db.account);


module.exports = db;