const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db/index');
const utils = require('../utils/index');

const router = express.Router();

let tokenExpiryLimit = '1d';
let saltLevel = 10;

/**
 * Add new user to db (SIGNUP)<br /><br />
 * validate USER-ID and PASSWORD if it meets application requirement.<br />
 * <br />
 * 1. Check if user already exists.<br />
 * 2. Hash the password.<br />
 * 3. Create DUMMY contacts for the user.(JUST LIKE AUTO IMPORTING USER CONTACTS)<br />
 * @param {string} userId 
 * @param {string} password 
 * @param {string} phone
 * @returns {object} added user object
 */

const handleNewUserSignup = async (userToAdd) => {
  /**
  * Do initial API level validation of input data. throw Error if the input is not as required
  */
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

  /**
   * if user already exists though user already exists
   */
  if (userFromDb) {
    return res.json({ success: false, message: 'User already exists... Please Login to your Account.' });
  }

  /**
   * HASH the password and save the digest
   */
  const passwordDigest = bcrypt.hashSync(userToAdd.password, saltLevel);

  /**
   * Fetch dummy contacts similar to auto import
   */
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

    const newUser = await handleNewUserSignup(req.body);
    res.json(newUser);
  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

/**
 * Do initial api validation and check if the user is available in db.<br /><br />
 * 1. match the password matches with saved password digest.<br/ >
 * 2. If every thing is ok. Login the user by generating token. <br />
 * <br />
 * <b>IMPORTANT</b><br /> 
 * <br />
 * 1. Do not use sensitive information in token data.<br />
 * 2. Use as maximum expire interval as possible once everything is stable. So that user has good experience<br />
 * 
 * @param {string} userId
 * @param {string} password 
 * @returns {string} token
 */
const handleLoginRequest = async (body) => {
  const { userId, password } = body;

  /**
   * Do initial API level validation of input data. throw Error if the input is not as required
   */
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Invalid username' });
  }
  if (!password) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  const userFromDb = await db.users.findOne({ userId: userId });

  /**
   * if the user is not there in db throw invalid user
   */
  if (!userFromDb) {
    res.status(401).json({ success: false, message: 'There is no such user' });
  }

  /**
   * compare if password matches with our digest. We can use sync compare as we are using less salt.
   */
  if (!bcrypt.compareSync(password, userFromDb.password)) {
    res.status(401).json({ success: false, message: 'Invalid Credentials' });
    return;
  }

  /**
   * If every thing is ok. Login the user by generating token. 
   * @important use as maximum expire interval as possible once everything is stable.
   * @important do not use sensitive information in token data.
   */
  const token = jwt.sign({
    userId: userFromDb.userId,
    userUUID: userFromDb.userUUID,
    phoneNumber: userFromDb.phoneNumber,
  }, utils.config.JWT.SECRET, {
    expiresIn: tokenExpiryLimit,
    issuer: utils.config.JWT.ISSUER,
    audience: utils.config.JWT.AUDIENCE
  });
  return token;
}


router.post('/login', async (req, res) => {
  try {
    const token = await handleLoginRequest(req.body);
    res.json({ success: true, token: token });

  } catch (error) {
    console.log('error: ', error);
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;