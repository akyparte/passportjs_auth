require('dotenv').config()
const express = require('express');
const cookieSession = require('cookie-session')
const passport = require('passport')
const isValidRequest = require('./middleware/is-valid-request')
const googleAuthRoute = require('./routes/google-auth');
const dataRoute = require('./routes/data-route')
require('./auth')

const app = express();


app.use(express.static(__dirname +'/public'))
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: process.env.COOKIE_KEYS.split(',')
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());



app.get('/',(req,res) => {
    res.sendFile(__dirname+'/index.html')
})

app.use('/auth',googleAuthRoute);

app.use('/data',dataRoute)

app.get('/logout',isValidRequest,(req,res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

app.listen(5000,() => {
    console.log('Listening on 5000')
})


