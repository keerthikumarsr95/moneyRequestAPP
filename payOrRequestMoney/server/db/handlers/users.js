const Users = require('../models/users');

const add = (queryObject) => {
  const newUser = new Users(queryObject);
  return newUser.save();
};

const find = queryObject => Users.find(queryObject).lean(true);

const findOne = queryObject => Users.findOne(queryObject).lean(true);

const findOneAndUpdate = (queryObject, updateObject) => Users.findOne(queryObject, updateObject);

const findOneAndRemove = queryObject => Users.findByIdAndRemove(queryObject);

module.exports = {
  add,
  find,
  findOne,
  findOneAndUpdate,
  findOneAndRemove,
};