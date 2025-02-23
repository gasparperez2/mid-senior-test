require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: 'password',
    database: 'loans_api',
    host: 'db',
    port: 5432
  },
  test: {
    username: 'postgres',
    password: 'password',
    database: 'loans_api_test',
    host: 'test_db',
    port: 6543
  },
  // In case we need to store sensitive credentials
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD
  }
};
