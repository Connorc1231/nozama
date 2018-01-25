const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const users = require('../database/users');

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    if (await users.getByName(username)) {
      return done(null, await users.getByName(username));
    }
    return done(null, false);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    return done(null, await users.getById(id));
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
