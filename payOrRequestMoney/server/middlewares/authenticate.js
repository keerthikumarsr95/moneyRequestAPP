const jwt = require('./jwt');
const utils = require('../utils/index');
const db = require('../db/index');

/**
 * get the TOKEN from AUTHORIZATION header and verify if the token is valid.<br />
 * <br />
 * 1. if not valid throw UNAUTHORIZED error.<br />
 * 2. if verified recognize the incoming user, if not found throw UNAUTHORIZED error.<br />
 * 3. If the user is recognized set the user information for further processing of request.<br />
 * 
 */

const authenticate = async (req, res, next) => {
  try {
    const headers = req.headers;
    const token = headers.authorization.split(' ')[1];
    const verifiedToken = await jwt.verify(token, utils.config.JWT.SECRET, utils.config.JWT.ISSUER, utils.config.JWT.AUDIENCE);
    if (verifiedToken) {
      const userFromDb = await db.users.findOne({ userId: verifiedToken.userId });
      if (userFromDb) {
        req.userId = userFromDb.userId;
        req.userUUID = userFromDb.userUUID;
        req.currentUser = userFromDb.userId;
        req.phoneNumber = userFromDb.phoneNumber;
        return next();
      }
    }
  } catch (error) {
    console.log('error: ', error);

  }
  return res.status(401).json({ success: false, message: 'Authentication Failed. Please Login Again' });

};

module.exports = authenticate;