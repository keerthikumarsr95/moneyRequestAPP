const users = require('./users');
const contacts = require('./contacts');
const transactions = require('./transactions');

const routes = {
  users,
  contacts,
  transactions
};

module.exports = routes;