const express = require('express');
const { books } = require('./booksdb.js');

const general = express.Router();
const public_users = express.Router();

public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

general.use('/', public_users);

module.exports.general = general;
