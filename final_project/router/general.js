const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books},null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let temp_isbn = req.params.isbn;
  if (temp_isbn>0 && temp_isbn<=Object.keys(books).length){
    res.send(books[temp_isbn]);
  } else {
      res.send({message:"Invalid ISBN number"});
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let temp_author = req.params.author;
  let filtered_books = Object.values(books).filter( books => books.author === temp_author);
  if(Object.keys(filtered_books).length){
    res.send(filtered_books);
  } else {
      res.send({message: "Books authored by " + temp_author + " not found"});
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let temp_title = req.params.title;
  let filtered_books = Object.values(books).filter( books => books.title === temp_title);
  if(Object.keys(filtered_books).length){
    res.send(filtered_books);
  } else {
      res.send({message: "Books authored by " + temp_title + " not found"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let temp_isbn = req.params.isbn;
  if (temp_isbn>0 && temp_isbn<=Object.keys(books).length){
    res.send(books[temp_isbn].reviews);
  } else {
      res.send({message:"Invalid ISBN number"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
