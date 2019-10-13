const express = require('express');
const db = require('../db/index');

const router = express.Router();

/**
 * Return All contacts for the requested user
 * @param {string} userUUID contacts needed USER-ID
 * @returns {Array} contacts array
 */
const handleGetAllContacts = async (userUUID) => {
  const userFromDb = await db.users.findOne({ userUUID });
  if (userFromDb) {
    return { success: true, contacts: userFromDb.contacts };
  } else {
    return { success: false, message: 'Unable to find contacts' };
  }
}

router.get('/', async (req, res) => {
  try {
    const { userUUID } = req;

    const contacts = await handleGetAllContacts(userUUID);
    res.json(contacts);
  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;