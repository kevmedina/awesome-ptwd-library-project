const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../../models/User.model');

// const routeGuard = require('../../configs/route-guard.config');

// Sign Up Page
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;

  // notify users that all fields have to be filled stays untouched
  if(!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'Please enter a username, email and password to create an account.'});
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  // Use Bcryptjs to hash the password with salts
  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    console.log('Password hash: ', hashedPassword);
    return User.create({
      username,
      email,
      passwordHash: hashedPassword
    })
  })
  .then(userFromDB => {
    console.log(`Newly created user is: ${userFromDB}`);
    res.redirect('/login');
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('auth/signup', { 
         errorMessage: 'Username and email need to be unique. Either username or email is already used.' 
      });
    } else {
      next(error);
    }
  })
});


// Login Page
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

// Authenticate user and take them to user profile page
router.post('/login', (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;
  // const { theUsername, thePassword } = req.body;

  if(theUsername === '' || thePassword === '') {
    res.render('auth/login', { 
      errorMessage: 'Please enter a username and password to login.'
    });
    return;
  }

  User.findOne({ 'username': theUsername })
  .then(user => {
    if (!user) {
      res.render('auth/login', { errorMessage: 'The username doesn\'t exist.' });
      return;
    } else if (bcryptjs.compareSync(thePassword, user.passwordHash)) {
      req.session.currentUser = user;
      res.redirect('/userProfile');
    } else {
      res.render('auth/login', { errorMessage: 'Incorrect password.' });
    }
  })
  .catch(error => next(error));
});


module.exports = router;
