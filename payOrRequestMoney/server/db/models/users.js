const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  userId: { type: String, default: undefined, required: true, unique: true },
  userUUID: { type: String, default: undefined, required: true, unique: true },
  password: { type: String, default: undefined },
  phoneNumber: { type: String, default: undefined },
  contacts: [
    {
      id: { type: String, default: undefined },
      name: { type: String, default: undefined },
      phoneNumber: { type: String, default: undefined },
      hasNewRequest: { type: Boolean, default: undefined },
      isPaidMore: { type: Boolean, default: undefined },
      needsToPay: { type: Boolean, default: undefined },
      amount: { type: Number, default: undefined },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('users', usersSchema);