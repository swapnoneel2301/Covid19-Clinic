const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');

// Load User model
const Corona_user = require('../models/User.js');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      Corona_user.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        // bcrypt.compare(password, user.password, (err, isMatch) => {
        //   if (err) throw err;
        //   if (isMatch) {
        //     return done(null, user);
        //   } else {
        //     return done(null, false, { message: 'Password incorrect' });
        //   }
        // });
        if(password===user.password)
         return done(null,user);
        else
        return done(null, false, { message: 'Password incorrect' });

      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Corona_user.findById(id, function(err, user) {
      done(err, user);
    });
  });
};