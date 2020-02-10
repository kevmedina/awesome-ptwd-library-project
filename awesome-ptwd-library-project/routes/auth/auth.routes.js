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


module.exports = router;
