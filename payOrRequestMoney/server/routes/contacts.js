const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db/index');
const utils = require('../utils/index');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { userUUID } = req;

    const userFromDb = await db.users.findOne({ userUUID: userUUID });
    if (userFromDb) {
      return res.json({ success: true, contacts: userFromDb.contacts });
    } else {
      res.json({ success: false, message: 'Unable to find contacts' });
    }
  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;