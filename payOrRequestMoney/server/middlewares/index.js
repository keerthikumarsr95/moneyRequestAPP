const authenticate = require('./authenticate');

const middleWares = {
  authenticate,
};

module.exports = middleWares;