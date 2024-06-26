require('dotenv').config();
module.exports = {
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_USER,
    PASSWORD: process.env.MYSQL_PASSWORD,
    DB: process.env.MYSQL_DB,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 90000,
      idle: 10000
    }
  };