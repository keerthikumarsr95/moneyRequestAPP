const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const APIKeysSchema = new Schema({
  orderId: { type: String, default: undefined },
  phOrderId: { type: String, default: undefined },

  apiToken: { type: String, default: undefined },
  storeId: { type: String, default: undefined },
  storeUrl: { type: String, default: undefined },
  activeFromDate: { type: String, default: undefined },
  isActive: { type: Boolean, default: undefined },
}, { timestamps: true });

module.exports = mongoose.model('apiKeys', APIKeysSchema);