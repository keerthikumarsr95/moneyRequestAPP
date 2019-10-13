const jwt = require('./jwt');
const utils = require('../utils/index');
const db = require('../db/index');

const authenticate = async (req, res, next) => {
  try {
    const headers = req.headers;
    const token = headers.authorization.split(' ')[1];
    const verifiedToken = await jwt.verify(token, utils.config.JWT.SECRET, utils.config.JWT.ISSUER, utils.config.JWT.AUDIENCE);
    if (verifiedToken) {
      const userFromDb = await db.users.findOne({ userId: verifiedToken.userId });
      console.log('userFromDb: ', userFromDb);
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
  return res.json({ success: false, message: 'Authentication Failed. Please Login Again' });

};

module.exports = authenticate;