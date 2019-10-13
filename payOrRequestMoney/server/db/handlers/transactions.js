const Orders = require('../models/transactions');

const add = (queryObject) => {
  const newOrder = new Orders(queryObject);
  return newOrder.save();
}

const find = queryObject => Orders.find(queryObject).lean(true);

const findWithSort = (queryObject, sortQuery) => Orders.find(queryObject).sort(sortQuery).lean(true);

const findOne = queryObject => Orders.findOne(queryObject).lean(true);

const findOneAndUpdate = (queryObject, updateObject) => Orders.findOneAndUpdate(queryObject, updateObject);

const findOneAndRemove = queryObject => Orders.findByIdAndRemove(queryObject);

module.exports = {
  add,
  find,
  findOne,
  findOneAndUpdate,
  findOneAndRemove,
  findWithSort,
};