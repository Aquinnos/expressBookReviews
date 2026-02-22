const express = require('express');
const axios = require('axios');
const { books } = require('./booksdb.js');

const general = express.Router();
const public_users = express.Router();

// Simple in-memory users store for registration
const users = [];

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

public_users.post('/register', function (req, res) {
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

  const existing = users.find((u) => u.username === username);
  if (existing) {
    return res
      .status(400)
      .send(JSON.stringify({ message: 'User already exists' }, null, 4));
  }

  users.push({ username, password });
  return res
    .status(200)
    .send(JSON.stringify({ message: 'User registered successfully' }, null, 4));
});

general.use('/', public_users);

module.exports.general = general;
module.exports.users = users;

const BASE_URL = 'http://localhost:5001';

async function getBooks() {
  try {
    const resp = await axios.get(`${BASE_URL}/`);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

async function getBookByISBN(isbn) {
  try {
    const resp = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

async function getBooksByAuthor(author) {
  try {
    const resp = await axios.get(
      `${BASE_URL}/author/${encodeURIComponent(author)}`,
    );
    return resp.data;
  } catch (err) {
    throw err;
  }
}

async function getBooksByTitle(title) {
  try {
    const resp = await axios.get(
      `${BASE_URL}/title/${encodeURIComponent(title)}`,
    );
    return resp.data;
  } catch (err) {
    throw err;
  }
}

module.exports.getBooks = getBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
