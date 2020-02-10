// require session
const session = require('express-session');

// ADDED: require mongostore
const MongoStore = require('connect-mongo')(session);

// ADDED: require mongoose
const mongoose = require('mongoose');

module.exports = app => {
  app.use(
    session({
      secret: 'basic-auth-secret',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 // 1 day
      })
    })
  );
};