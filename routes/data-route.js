const express = require('express');
const passport = require('passport');
const path = require('path');
const isValidRequest = require('../middleware/is-valid-request')

const dataRoute = express.Router();

dataRoute.get('/',isValidRequest,(req , res) => {
    console.log('6')
   if(req.user){

      let finalPath = path.resolve(__dirname,'../','data.html');
      // res.send(finalPath)
      res.sendFile(finalPath)
   }else {
      res.redirect('/');
   }
})
module.exports = dataRoute;
