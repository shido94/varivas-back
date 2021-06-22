
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const User = require('../models/user')

module.exports = function (app) {
  app.use(require('cookie-parser')());
  app.use(require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize())
  app.use(passport.session())

  // Passport Google Auth
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/user/auth/google/callback',
    passReqToCallback: true
  },
    function (request, accessToken, refreshToken, profile, done) {
      const jsonData = profile._json;
      // Check If user Exist
      User.findOne({ googleId: jsonData.sub, email: jsonData.email })
        .then(function (user) {
          if (user) {
            // If exist return
            return done(null, user)
          } else {
            // Else create new user with valid details
            let newUser = {
              provider: 'google',
              googleId: jsonData.sub,
              name: `${jsonData.given_name} ${jsonData.family_name}`,
              email: jsonData.email,
              image: jsonData.picture ? jsonData.picture : ''
            };
            const user = new User(newUser);
            user.save((err, result) => {
              if (err) {
                Logger.error(err);
                return done(null, false, {
                  message: 'Error occurred'
                });
              } else {
                return done(null, result);
              }
            });
          }
        })
        .catch(error => {
          Logger.error(error);
          return done(null, error);
        })
    }));

  passport.serializeUser(function (user, done) {
    done(null, user);
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then(function (user) {
        done(null, user)
      })
      .catch(done)
  })

  return passport
}
