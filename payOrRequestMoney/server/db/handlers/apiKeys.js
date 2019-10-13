const APIKeys = require('../models/apiKeys');

const add = (queryObject) => {
  const newAPIKey = new APIKeys(queryObject);
  return newAPIKey.save();
};

const find = queryObject => APIKeys.find(queryObject).lean(true);

const count = queryObject => APIKeys.countDocuments(queryObject);

const findOne = queryObject => APIKeys.findOne(queryObject).lean(true);

const findOneAndUpdate = (queryObject, updateObject) => APIKeys.findOne(queryObject, updateObject);

const findOneAndRemove = queryObject => APIKeys.findByIdAndRemove(queryObject);

module.exports = {
  add,
  find,
  findOne,
  count,
  findOneAndUpdate,
  findOneAndRemove,
};