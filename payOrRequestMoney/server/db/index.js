const users = require('./handlers/users');
const transactions = require('./handlers/transactions');
const apiKeys = require('./handlers/apiKeys');

const db = {
  users,
  transactions,
  apiKeys,
};

module.exports = db;