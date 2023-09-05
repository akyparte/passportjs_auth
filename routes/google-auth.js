const express = require('express');
const passport = require('passport')

const googleAuthRoute = express.Router();

googleAuthRoute.get('/google', passport.authenticate('google', { scope: ['profile'] }));

googleAuthRoute.get('/google/callback', passport.authenticate('google'), function (req, res) {
        res.redirect('/data');
    });

    
module.exports = googleAuthRoute;
