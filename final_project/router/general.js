const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// POST /register - Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required." });
    }
    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists." });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
});

// GET / - Get all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// GET /isbn/:isbn - Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

// GET /author/:author - Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let results = [];

    for (let isbn in books) {
        if (books[isbn].author === author) {
            results.push({ isbn, ...books[isbn] });
        }
    }

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "No books found for this author." });
    }
});

// GET /title/:title - Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let results = [];

    for (let isbn in books) {
        if (books[isbn].title === title) {
            results.push({ isbn, ...books[isbn] });
        }
    }

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "No books found for this title." });
    }
});

// GET /review/:isbn - Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book." });
    }
});

module.exports.general = public_users;

// -----------------
// Async versions for Tasks 10-13
// -----------------

// Task 10: Get all books using async-await
const getBooksAsync = async () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

// Example usage for Task 10
getBooksAsync()
    .then(result => console.log("Task 10 - List of Books:\n", JSON.stringify(result, null, 4)))
    .catch(error => console.log(error));

// Task 11: Get book details based on ISBN using async-await
const getBookByISBNAsync = async (isbn) => {
    return new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });
};

// Example usage for Task 11
getBookByISBNAsync("1")
    .then(book => console.log("Task 11 - Book by ISBN:\n", book))
    .catch(error => console.log(error));

// Task 12: Get book details based on author using async-await
const getBooksByAuthorAsync = async (author) => {
    return new Promise((resolve, reject) => {
        let results = [];
        for (let isbn in books) {
            if (books[isbn].author === author) {
                results.push({ isbn, ...books[isbn] });
            }
        }
        if (results.length > 0) {
            resolve(results);
        } else {
            reject("No books found for this author");
        }
    });
};

// Example usage for Task 12
getBooksByAuthorAsync("Chinua Achebe")
    .then(books => console.log("Task 12 - Books by Author:\n", books))
    .catch(error => console.log(error));

// Task 13: Get book details based on title using async-await
const getBooksByTitleAsync = async (title) => {
    return new Promise((resolve, reject) => {
        let results = [];
        for (let isbn in books) {
            if (books[isbn].title === title) {
                results.push({ isbn, ...books[isbn] });
            }
        }
        if (results.length > 0) {
            resolve(results);
        } else {
            reject("No books found for this title");
        }
    });
};

// Example usage for Task 13
getBooksByTitleAsync("Things Fall Apart")
    .then(books => console.log("Task 13 - Books by Title:\n", books))
    .catch(error => console.log(error));
