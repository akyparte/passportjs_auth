
const passport = require('passport')
const config = require('./client_secret_805045634357-d7htr7n1qhibn9qioh2f8tj1kvlg32nb.apps.googleusercontent.com.json')
const { User } = require('./db/database')

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: config.client_id,
  clientSecret: config.client_secret,
  callbackURL: "http://localhost:5000/auth/google/callback",
},
  function (accessToken, refreshToken, profile, done) {
    User.findOne({ where: { googleid: profile.id } }).then((user) => {
      if(user){
        console.log('user is: ', user.dataValues);
        done(null, user.dataValues);
      }else {
         User.create({
           username:profile.displayName,
           googleid:profile.id
         }).then((newUser) => {
          console.log('created new user: ', newUser.dataValues);
          done(null, newUser.dataValues);
         })
      }
    })
  }
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({where:{id:id}}).then((user) => {
      done(null, user.dataValues);
  });
});