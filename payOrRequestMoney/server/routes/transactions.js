const express = require('express');
const db = require('../db/index');
const utils = require('../utils/index');

const router = express.Router();

const notifyRequestToUser = async (toUser, fromUser, amount) => {
  const fromContactFromToUserIndex = toUser.contacts.findIndex(c => c.phoneNumber === fromUser.phoneNumber);
  toUser.contacts[fromContactFromToUserIndex].hasNewRequest = true;
  await db.users.findOneAndUpdate({ userUUID: toUser.userUUID }, { contacts: toUser.contacts });
  utils.sockets.emit({ phoneNumber: toUser.phoneNumber })
  utils.sockets.emit({ phoneNumber: fromUser.phoneNumber })
};

const processTransactions = async (transactions, amount) => {
  let remaining = amount;
  for (let index = 0; index < transactions.length; index++) {
    const transaction = transactions[index];
    if (remaining > 0 && (transaction.amount >= remaining)) {
      remaining -= transaction.amount;
      await db.transactions.findOneAndUpdate({ id: transaction.id }, { isCompleted: true });
    } else {
      break;
    }
  }
  return remaining;
}

const processPaymentRequest = async (toUser, fromUser, amount) => {
  const transactions = await db.transactions.find({ type: 'REQUEST', from: toUser.phoneNumber, to: fromUser.phoneNumber });
  const fromContactFromToUserIndex = toUser.contacts.findIndex(c => c.phoneNumber === fromUser.phoneNumber);
  if (transactions.length) {
    const finalAmountRemaining = await processTransactions(transactions, amount);
    toUser.contacts[fromContactFromToUserIndex].amount = amount;
    toUser.contacts[fromContactFromToUserIndex].isPaidMore = finalAmountRemaining > 0;
  } else {
    toUser.contacts[fromContactFromToUserIndex].amount = amount;
    toUser.contacts[fromContactFromToUserIndex].isPaidMore = true;
  }
  await db.users.findOneAndUpdate({ userUUID: toUser.userUUID }, { contacts: toUser.contacts });
  utils.sockets.emit({ phoneNumber: toUser.phoneNumber })
  utils.sockets.emit({ phoneNumber: fromUser.phoneNumber })
};

router.post('/request', async (req, res) => {
  try {
    const { userUUID } = req;
    const { to, amount, phoneNumber } = req.body;
    console.log('phoneNumber: ', phoneNumber);
    const toUser = await db.users.findOne({ phoneNumber });
    const fromUser = await db.users.findOne({ userUUID: userUUID });

    const transaction = {
      id: utils.common.getUUID(),
      from: fromUser.phoneNumber,
      to: toUser.phoneNumber,
      amount: amount,
      type: 'REQUEST',
      isCompleted: false,
      date: new Date().toISOString(),
    };
    const addedTransaction = db.transactions.add(transaction);
    notifyRequestToUser(toUser, fromUser, amount);
    return res.json({ success: true });
  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

router.post('/pay', async (req, res) => {
  try {
    const { userUUID } = req;
    const { to, amount, phoneNumber } = req.body;
    const toUser = await db.users.findOne({ phoneNumber });
    const fromUser = await db.users.findOne({ userUUID: userUUID });

    const transaction = {
      id: utils.common.getUUID(),
      from: fromUser.phoneNumber,
      to: toUser.phoneNumber,
      amount: amount,
      type: 'PAY',
      isCompleted: true,
      date: new Date().toISOString(),
    };
    const addedTransaction = db.transactions.add(transaction);
    await processPaymentRequest(toUser, fromUser, amount);

    res.json({ success: true });
  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userUUID, phoneNumber: fromPhoneNumber } = req;
    const { phoneNumber } = req.query;
    const contactId = await db.users.findOne({ phoneNumber });
    // console.log('phoneNumber: ', phoneNumber);
    // console.log('contactId: ', contactId);
    const queryObject = {
      from: { $in: [fromPhoneNumber, contactId.phoneNumber] },
      to: { $in: [fromPhoneNumber, contactId.phoneNumber] }
    }
    console.log('queryObject: ', queryObject);
    const transactions = await db.transactions.findWithSort(queryObject, { date: 1 })
    // console.log('transactions: ', transactions);
    if (transactions && transactions.length) {
      return res.json({ success: true, transactions });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.log('error: ', error);
    return res.json({ success: false });
  }

});

module.exports = router;