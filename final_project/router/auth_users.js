const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //let temp_user = {"username": req.query.username, "password": req.password};
  const username = req.query.username;
  const password = req.query.password;
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password" + users});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let new_review = {"username":req.session.authorization["username"], "review":req.query.review}
  if(books[req.isbn].reviews.length == 0){
      //review successfully added
      books[req.isbn].reviews.push(new_review);
      res.send({message: "Book review added. Reviews for book" + books[req.query.isbn].title + " are: "+ books[req.query.isbn].reviews})
  } else {
    let review_flag = true;
    const bookReviews = books[req.query.isbn].reviews;

    for (const existingReview of bookReviews) {
        if (existingReview.username === new_review.username) {
            // Review found, update it
            existingReview.review = new_review.review;
            review_flag = false;
            res.send({message: "Book review updated. Reviews for book" + books[req.query.isbn].title + " are: "+ books[req.query.isbn].reviews})
            break; // No need to continue looping once the review is updated
        }
    }

    if (review_flag) {
        // Review not found, add it
        books[req.query.isbn].reviews.push(new_review);
        res.send({message: "Book review added. Reviews for book" + books[req.query.isbn].title + " are: "+ books[req.query.isbn].reviews})
    }
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
