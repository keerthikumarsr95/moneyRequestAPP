const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionsSchema = new Schema({
  id: { type: String, default: undefined, unique: true },
  from: { type: String, default: undefined },
  to: { type: String, default: undefined },
  amount: { type: Number, default: undefined },
  type: { type: String, default: undefined },
  isCompleted: { type: Boolean, default: undefined },
  date: { type: Date, default: undefined },
}, { timestamps: true });

module.exports = mongoose.model('transactions', transactionsSchema);