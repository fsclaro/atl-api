const mongoose = require('mongoose');
require('dotenv/config');

const uri = process.env.API_DB_DRIVER +
  process.env.API_DB_USER + ":" +
  process.env.API_DB_PASSWORD + "@" +
  process.env.API_DB_HOST + "/" +
  process.env.API_DB_DATABASE + "?" +
  process.env.API_DB_PARAMS;

mongoose.connect(uri);

mongoose.Promise = global.Promise;

module.exports = mongoose;
