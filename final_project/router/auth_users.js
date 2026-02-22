const express = require('express');
const jwt = require('jsonwebtoken');
const { books } = require('./booksdb.js');
const { users } = require('./general.js');

const authenticated = express.Router();
const regd_users = express.Router();

authenticated.post('/login', function (req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res
      .status(400)
      .send(
        JSON.stringify(
          { message: 'Username and password are required' },
          null,
          4,
        ),
      );
  }

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (user) {
    const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });
    req.session.authorization = { accessToken };
    return res
      .status(200)
      .send(JSON.stringify({ message: 'Login successful' }, null, 4));
  } else {
    return res
      .status(401)
      .send(
        JSON.stringify({ message: 'Invalid username or password' }, null, 4),
      );
  }
});

regd_users.put('/auth/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res
      .status(400)
      .send(
        JSON.stringify(
          { message: 'Review query parameter is required' },
          null,
          4,
        ),
      );
  }

  const book = books[isbn];
  if (!book) {
    return res
      .status(404)
      .send(JSON.stringify({ message: 'Book not found' }, null, 4));
  }

  const username = req.user && req.user.username;
  if (!username) {
    return res
      .status(403)
      .send(JSON.stringify({ message: 'Unauthorized' }, null, 4));
  }

  book.reviews[username] = review;
  return res
    .status(200)
    .send(
      JSON.stringify(
        { message: 'Review added/modified successfully' },
        null,
        4,
      ),
    );
});

regd_users.delete('/auth/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res
      .status(404)
      .send(JSON.stringify({ message: 'Book not found' }, null, 4));
  }

  const username = req.user && req.user.username;
  if (!username) {
    return res
      .status(403)
      .send(JSON.stringify({ message: 'Unauthorized' }, null, 4));
  }

  if (
    book.reviews &&
    Object.prototype.hasOwnProperty.call(book.reviews, username)
  ) {
    delete book.reviews[username];
    return res
      .status(200)
      .send(
        JSON.stringify({ message: 'Review deleted successfully' }, null, 4),
      );
  }

  return res
    .status(404)
    .send(JSON.stringify({ message: 'Review not found for user' }, null, 4));
});

authenticated.use('/', regd_users);

module.exports.authenticated = authenticated;
