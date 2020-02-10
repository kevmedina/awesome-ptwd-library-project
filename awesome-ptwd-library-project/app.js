require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const createError = require('http-errors');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const bindUserToViewLocals = require('./configs/user-in-view-locals.config');

// require database configuration
require('./configs/db.config');


const app = express();

// use session here:                 V
require('./configs/session.config')(app);
require('./configs/user-in-view-locals.config');

// Middleware Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bindUserToViewLocals);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
// Express View engine setup


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// const index = require('./routes/index');
// app.use('/', index);
//      |  |  |
//      |  |  |
//      V  V  V
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth/auth.routes'));
app.use('/', require('./routes/author.routes'));
app.use('/', require('./routes/book.routes'));

// Catch missing routes and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Catch all error handler
app.use((error, req, res) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  // render the error page
  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
