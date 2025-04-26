const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Function to check if username and password match
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// POST /customer/login - Login a registered user
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required." });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            { username: username },
            "fingerprint_customer",
            { expiresIn: '1h' }
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({ message: "User logged in successfully." });
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password." });
    }
});

// PUT /customer/auth/review/:isbn - Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({ message: "Review is required." });
    }

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added/updated successfully." });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

// DELETE /customer/auth/review/:isbn - Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully." });
    } else {
        return res.status(404).json({ message: "Review not found for this user." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
