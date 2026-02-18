const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ name: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfuly registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const allBooks = await new Promise((resolve, reject) => resolve(books));
    return res.status(200).json(allBooks);
  } catch (e) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;
  try {
    const bookDetail = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    });
    return res.status(200).json(bookDetail);
  } catch (e) {
    res.status(500).json({ message: "Error retriving book details" });
  }
});

// Get book details based on author
public_users.get("/books", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;

  try {
    const bookDetail = await new Promise((resolve, reject) => {
      for (const book of Object.keys(books)) {
        const bookAuthor = books[book].author.toLowerCase();
        if (bookAuthor.includes(author.toLowerCase())) {
          resolve(books[book]);

          return;
        }
      }

      return res
        .status(400)
        .json({ message: `No book found for author ${author}` });
    });

    return res.status(200).json(bookDetail);
  } catch (e) {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;

  try {
    const bookDetail = await new Promise((resolve, reject) => {
      for (const book of Object.keys(books)) {
        const bookTitle = books[book].title.toLowerCase();
        if (bookTitle.includes(title.toLowerCase())) {
          resolve(books[book]);

          return;
        }
      }

      return res
        .status(400)
        .json({ message: `No book found for title ${title}` });
    });

    return res.status(200).json(bookDetail);
  } catch (e) {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `Review not found for ${isbn}` });
  }
});

module.exports.general = public_users;
