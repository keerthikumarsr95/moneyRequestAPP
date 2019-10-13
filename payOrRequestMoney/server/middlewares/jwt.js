const jwt = require('jsonwebtoken');

const verify = (token, jwtSecret, issuer, audience) => new Promise((resolve, reject) => {
  jwt.verify(token, jwtSecret, { issuer, audience }, (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
});

const sign = (data, secret, expiresIn, issuer, audience) => {
  return jwt.sign(data, secret, { expiresIn, issuer, audience });
}

module.exports = {
  verify,
  sign,
};