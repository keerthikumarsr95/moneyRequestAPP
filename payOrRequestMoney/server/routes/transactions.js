const express = require('express');
const db = require('../db/index');
const utils = require('../utils/index');

const router = express.Router();

/**
 * Mark the TO user that he has a new request from FROM user.<br />
 * UPDATE client using SOCKETS
 */
const notifyRequestToUser = async (toUser, fromUser, amount) => {
  const fromContactFromToUserIndex = toUser.contacts.findIndex(c => c.phoneNumber === fromUser.phoneNumber);
  toUser.contacts[fromContactFromToUserIndex].hasNewRequest = true;
  await db.users.findOneAndUpdate({ userUUID: toUser.userUUID }, { contacts: toUser.contacts });
  utils.sockets.emit({ phoneNumber: toUser.phoneNumber })
  utils.sockets.emit({ phoneNumber: fromUser.phoneNumber })
};

/**
 * 
 * If there is REMAINING amount and if the REQUESTED amount is AVAILABLE mark the transaction as COMPLETED and repeat for next transaction.<br />
 * 
 * @param {Array} transactions TRANSACTIONS Array
 * @param {float} amount AMOUNT to process
 * @returns {float} remaining amount
 */
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

/**
 * Check if there are any REMAINING PAYMENT REQUEST transactions, process them and marking them completed.<br/>
 * <br />
 * if there are no previous transactions mark as PAID MORE.
 * UPDATE client with using SOCKETS
 * 
 * @param {object} toUser TO User Object
 * @param {object} fromUser FROM User Object
 * @param {float} amount Amount to process
 */
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

/** 
 * Here we handle when ever an request for payment (AN PAYMENT REQUEST TRANSACTION).<br />
 * <br />
 * 1. Add a REQUEST transaction to transactions collection.<br />
 * 2. Mark the TO user that he has new payment request from FROM user.<br />
 * 3. Also use sockets to auto update the client<br />
 * 
 * @param {Object} userUUID FROM user identifier
 * @param {float} amount AMOUNT to request
 * @param {string} toPhoneNumber TO user identifier
 * @returns transaction status.
 * 
*/

const handlePaymentRequest = async (inputObject) => {
  const { userUUID, to, amount, phoneNumber } = inputObject;

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
  const addedTransaction = await db.transactions.add(transaction);
  notifyRequestToUser(toUser, fromUser, amount);
}

router.post('/request', async (req, res) => {
  try {
    const { userUUID } = req;
    const { to, amount, phoneNumber } = req.body;
    let inputObject = {
      userUUID,
      to,
      amount,
      phoneNumber
    };
    await handlePaymentRequest(inputObject);
    return res.json({ success: true });
  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

/** 
 * Here we handle when ever an payment is done (AN PAYMENT TRANSACTION).<br/>
 * <br />
 * 1. Add a PAY transaction to transactions collection. <br/>
 * 2. Process previous incomplete REQUEST transaction, mark the fulfilled transaction as COMPLETED.<br/>
 * 3. Get the REMAINING amount after processing transaction, based on remaining amount mark PAID MORE or NEED TO PAY MORE.<br/>
 * <br/>
 * TODO: need to handle PARTIAL PAYMENTS. one way is to keep track of PAID and BALANCE and make use in next payment transaction.
 * @param {string} userUUID FROM user identifier
 * @param {float} amount AMOUNT to pay
 * @param {string} PhoneNumber TO user identifier
 * @returns transaction status.
 * 
*/

const handleNewPayment = async (inputObject) => {
  const { userUUID, to, amount, phoneNumber } = inputObject;

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
  const addedTransaction = await db.transactions.add(transaction);
  await processPaymentRequest(toUser, fromUser, amount);
};

router.post('/pay', async (req, res) => {
  try {
    const { userUUID } = req;
    const { to, amount, phoneNumber } = req.body;
    const inputObject = {
      userUUID,
      to,
      amount,
      phoneNumber
    };
    await handleNewPayment(inputObject);

    res.json({ success: true });
  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

/**
 * Return All transactions between FROM and TO user
 * @param {string} fromPhoneNumber
 * @param {string} toPhoneNumber
 * @returns {Array} Transactions Array 
 */
const handleGetAllTransactionsRequest = async (inputObject) => {
  const { fromPhoneNumber, phoneNumber } = inputObject;
  const contactId = await db.users.findOne({ phoneNumber });

  const queryObject = {
    from: { $in: [fromPhoneNumber, contactId.phoneNumber] },
    to: { $in: [fromPhoneNumber, contactId.phoneNumber] }
  }
  const transactions = await db.transactions.findWithSort(queryObject, { date: 1 })
  if (transactions && transactions.length) {
    return { success: true, transactions };
  } else {
    return { success: false };
  }
}

router.get('/', async (req, res) => {
  try {
    const { userUUID, phoneNumber: fromPhoneNumber } = req;
    const { phoneNumber } = req.query;
    const inputObject = {
      userUUID,
      fromPhoneNumber,
      phoneNumber
    };
    const response = await handleGetAllTransactionsRequest(inputObject)
    res.json(response)
  } catch (error) {
    console.log('error: ', error);
    return res.json({ success: false });
  }

});

module.exports = router;