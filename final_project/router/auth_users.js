const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userWithSameName = users.filter((user) => user.name === username);
  if (userWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validUser = users.filter((user) => {
    return user.name === username && user.password === password;
  });
  if (validUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 },
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    req.session.save(() => {
      return res.status(200).send("User successfully logged in");
    });
  } else {
    return res.status(208).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const { isbn } = req.params;
  const { review } = req.query;

  if (books[isbn]) {
    if (review) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
    } else {
      return res.status(400).json({ message: "Invalid rating or review" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const { isbn } = req.params;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
