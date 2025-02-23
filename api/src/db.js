require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const config = require('../config/config.js')[process.env.NODE_ENV || "development"]

const sequelize = new Sequelize(`postgres://${config.username}:${config.password}@${config.host}/${config.database}`, {
  logging: false,
  native: false,
});

// sync models with the already created database
async function syncModels() {
  try {
    // Authenticate connection
    await sequelize.authenticate();
    console.log('Database connected.');

    // Sync models (without altering the database schema)
    await sequelize.sync({ alter: false }); // Prevent altering schema
    console.log('Models synced successfully.');
  } catch (error) {
    console.error('Error syncing models:', error);
  }
}

syncModels();

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
});

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { Users, Loans, Payments } = sequelize.models;

Users.hasMany(Loans, { foreignKey: 'user_id' });
Loans.belongsTo(Users, { foreignKey: 'user_id' });
Loans.hasMany(Payments, { foreignKey: 'loan_id' });
Payments.belongsTo(Loans, { foreignKey: 'loan_id' });


module.exports = {
  ...sequelize.models, 
  conn: sequelize,    
};