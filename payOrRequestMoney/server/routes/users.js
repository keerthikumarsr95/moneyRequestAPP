const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db/index');
const utils = require('../utils/index');

const router = express.Router();

let tokenExpiryLimit = '1d';
let saltLevel = 10;

const addNewUser = async (userToAdd) => {
  const passwordDigest = bcrypt.hashSync(userToAdd.password, saltLevel);
  const contacts = utils.sampleContacts.get();
  const contactsToAdd = contacts.map((contact) => {
    return {
      id: utils.common.getUUID(),
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      isPaidMore: false,
      needsToPay: false,
      amount: 0,
    };
  });
  const contactToAdd = {
    userId: userToAdd.userId,
    userUUID: utils.common.getUUID(),
    phoneNumber: userToAdd.phoneNumber,
    password: passwordDigest,
    contacts: contactsToAdd
  }
  const user = await db.users.add(contactToAdd);
  if (user && user.userId === userToAdd.userId) {
    return { success: true };
  }
  return { success: false, message: 'Error in registering.' };
};

router.post('/signup', async (req, res) => {
  try {
    const { userId, password, phoneNumber } = req.body;
    if (!userId) {
      return res.json({ success: false, message: 'Invalid username' });
    }
    if (!password) {
      return res.json({ success: false, message: 'Invalid password' });
    }
    if (!phoneNumber) {
      return res.json({ success: false, message: 'Invalid Phone Number' });
    }

    const userFromDb = await db.users.findOne({ userId: userId });
    if (userFromDb) {
      return res.json({ success: false, message: 'User already exists... Please Login to your Account.' });
    }
    const newUser = await addNewUser(req.body);
    res.json(newUser);
  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId) {
      return res.json({ success: false, message: 'Invalid username' });
    }
    if (!password) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    const userFromDb = await db.users.findOne({ userId: userId });

    if (!userFromDb) {
      res.json({ success: false, message: 'There is no such user' });
    }
    
    if (!bcrypt.compareSync(password, userFromDb.password)) {
      res.status(401).json({ success: false, message: 'Invalid Credentials' });
      return;
    }

    const token = jwt.sign({
      userId: userFromDb.userId,
      userUUID: userFromDb.userUUID,
      userRole: userFromDb.userRole,
      phoneNumber: userFromDb.phoneNumber,
    }, utils.config.JWT.SECRET, {
      expiresIn: tokenExpiryLimit,
      issuer: 'LOGIN_SERVICES',
      audience: 'WEB_USER'
    });
    res.json({ success: true, token: token });

  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;