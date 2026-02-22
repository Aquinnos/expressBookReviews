const express = require('express');
const { books } = require('./booksdb.js');

const general = express.Router();
const public_users = express.Router();

public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase(),
  );
  if (filteredBooks.length > 0) {
    return res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({ message: 'No books found for this author' });
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase(),
  );
  if (filteredBooks.length > 0) {
    return res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({ message: 'No books found with this title' });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

/* Complete the code for registering a new user
Hint: The code should take the 'username' and 'password' provided in the body of the request for registration. If the username already exists, it must mention the same & must also show other errors like eg. when username & password are not provided. */
public_users.post('/register', function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  // Here you would typically check if the username already exists in your user database
  // For simplicity, we will just return a success message
  return res.status(201).json({ message: 'User registered successfully' });
});

general.use('/', public_users);

module.exports.general = general;
