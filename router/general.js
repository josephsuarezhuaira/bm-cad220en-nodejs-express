const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});  
});

// Get the book list available in the shop
public_users.get('/books', (req, res) => {
  res.status(200).json(books);
});

// Lista de libros usando Axios + async/await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});


// Get book details based on ISBN
public_users.get('/async/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/async/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching book by ISBN",
      error: error.message
    });
  }
});


  
// Get book details based on author
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const results = [];

  Object.values(books).forEach(book => {
    if (book.author.toLowerCase() === author) {
      results.push(book);
    }
  });

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "No books found for the author" });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/async/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by author",
      error: error.message
    });
  }
});

// Get all books based on title
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const results = [];

  Object.values(books).forEach(book => {
    if (book.title.toLowerCase().includes(title)) {
      results.push(book);
    }
  });

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "No books found for the title" });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/async/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by title",
      error: error.message
    });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
