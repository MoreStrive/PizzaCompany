const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('fast_food', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3308,
  logging: true,
});

export default sequelize;
