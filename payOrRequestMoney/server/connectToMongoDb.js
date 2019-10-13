const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/actyv', { useNewUrlParser: true, useCreateIndex: true });

module.exports = mongoose;