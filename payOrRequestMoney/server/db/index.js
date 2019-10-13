const users = require('./handlers/users');
const transactions = require('./handlers/transactions');

const db = {
  users,
  transactions,
};

module.exports = db;