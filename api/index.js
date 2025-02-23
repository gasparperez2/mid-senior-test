const server = require('./src/app.js');
const { conn } = require('./src/db.js');

const PORT = process.env.NODE_ENV == 'test' ? 8080 : 3000

conn.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log('%s listening at ' + String(PORT)); // eslint-disable-line no-console
  });
});