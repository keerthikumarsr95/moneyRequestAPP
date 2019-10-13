const Orders = require('../models/transactions');

/** 
 * Handle Db actions
 * @param {object} initObject
 * @return {object} addedRecord
*/
const add = (initObject) => {
  const newOrder = new Orders(initObject);
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