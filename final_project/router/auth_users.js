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

function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }

let displayReviews = (reviews) => {
    let res = "";
    Object.entries(reviews).map((user,review) => {
        res+="user: "+user+" review: "+review+'\n'
    })
    return res;
}

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let current_user = req.session.authorization['username'];
  let new_review = {"review":req.query.review};
  if(isEmpty(books[req.params.isbn]["reviews"])){
      //review successfully added
      
      Object.assign(books[req.params.isbn]["reviews"],{[current_user] : new_review});
      let reviewMessages = [];
        Object.entries(books[req.params.isbn]["reviews"]).forEach(([user, review]) => {
            reviewMessages.push(`User: ${user}, Review: ${review.review}`);
        });
        res.send({message: "Book review added. Reviews for book" + books[req.params.isbn]["title"] + " are: \n"+ reviewMessages})
    } else {
    let review_flag = true;
    //const bookReviews = books[req.params.isbn]["reviews"];
    Object.keys(books[req.params.isbn]["reviews"]).forEach(review_user => {
        if(review_user == current_user){
            // Review found, update it
            books[req.params.isbn]["reviews"][review_user] = new_review;
            review_flag = false;
            //res.send({message: books[req.params.isbn]["reviews"]})
            let reviewMessages = [];
            Object.entries(books[req.params.isbn]["reviews"]).forEach(([user, review]) => {
                reviewMessages.push(`User: ${user}, Review: ${review.review}`);
            });
            res.send({message: "Book review updated. Reviews for book" + books[req.params.isbn]["title"] + " are: \n"+ reviewMessages});
        }
    });

    if (review_flag) {
        // Review not found, add it
        Object.assign(books[req.params.isbn]["reviews"],{[current_user] : new_review});
        //res.send({message: books[req.params.isbn]["reviews"]})
        let reviewMessages = [];
        Object.entries(books[req.params.isbn]["reviews"]).forEach(([user, review]) => {
            reviewMessages.push(`User: ${user}, Review: ${review.review}`);
        });
        res.send({message: "Book review added. Reviews for book" + books[req.params.isbn]["title"] + " are: \n"+ reviewMessages})
    }
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
