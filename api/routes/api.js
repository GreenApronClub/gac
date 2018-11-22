const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../../config/database');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const xssFilters = require('xss-filters');
const User = require('../../models/user');
const signupValidation = require('../../validation/signupValidation.js');
const loginValidation = require('../../validation/loginValidation.js');
const stockValidation = require('../../validation/stockValidation.js');
const loadCollection = require('../../utils/utils.js');
const createDompurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDompurify(window);
const validator = require("validator");
const Stock = require('../../models/stock');
const Cart = require('../../models/cart');

router.post('/new_strain', (req, res) => {
  var newStockData = req.body;
  var cleanStockData = {};
  for(var key in newStockData) {
    cleanStockData[key] = DOMPurify.sanitize(newStockData[key]);
    cleanStockData[key] = validator.escape(cleanStockData[key]);
  }
  var validatedStock = stockValidation.validate(
    cleanStockData.price
  );
  var validatedStockData = stockValidation.validatedStockData;
  var newStrain = new Stock({
    name: cleanStockData.name,
    price: validatedStockData.price,
    image: newStockData.image
  });
  newStrain.save(err => {
    if (err) {
      res.json({error: "Something went wrong!"});
    } else {
      res.json({success: true, msg: "Success"});
    }
  })
});

router.get('/strains', (req, res) => {
  var query = Stock.find({}).select('name price image -_id');
  query.exec(function(err, stocks) {
    if (err) return err;
    res.json(stocks);
    });
});

router.post('/signup', (req, res) => {
  var signupData = req.body;
  var cleanSignupData = {};
  if (!signupData.email || !signupData.password) {
    res.json({success: false, msg: 'Please enter an email and a password.'});
  } else if (!signupData.ageverification) {
    res.json({success: false, msg: 'You must be 21 years of age or older in the state of Massachusetts to use our services.'});
  } else {
    for(var key in signupData) {
      cleanSignupData[key] = DOMPurify.sanitize(signupData[key]);
      cleanSignupData[key] = validator.escape(cleanSignupData[key]);
    }
    var validatedSignup = signupValidation.validate(
      cleanSignupData.email,
      cleanSignupData.firstname,
      cleanSignupData.lastname,
      cleanSignupData.password,
      cleanSignupData.address,
      cleanSignupData.address2,
      cleanSignupData.city,
      cleanSignupData.zipcode,
      cleanSignupData.phonenumber,
      cleanSignupData.ageverification
    );
    var validatedSignupData = signupValidation.validatedSignupData;
    if (validatedSignup === true) {
      var newUser = new User({
        email: validatedSignupData.email,
        password: validatedSignupData.password,
        first_name: validatedSignupData.firstName,
        last_name: validatedSignupData.lastName,
        address: validatedSignupData.address,
        address2: validatedSignupData.address2,
        city: validatedSignupData.city,
        zip_code: validatedSignupData.zipCode,
        phone_number: validatedSignupData.phoneNumber,
        age_verification: validatedSignupData.ageVerification
      });
      newUser.save(err => {
        if (err && err.code === 11000) {
            console.log(err.code)
            return res.json({success: false, msg: 'The email provided is already in use.', reason: "Email already in use", error: err});
        } else if (err && err.errors.email) {
            console.log(err)
            return res.json({success: false, msg: 'Email validation error', error: err.errors.email.kind});
        } else if (err && err.errors.first_name) {
            console.log(err)
            return res.json({success: false, msg: 'First name validation error', error: err.errors.first_name.kind});
        } else if (err && err.errors.password) {
            console.log(err)
            if (err.errors.password.kind === "minlength") {
              return res.json({success: false, msg: 'Password must be at least 8 characters long', error: err.errors.password.kind});
            } else {
              return res.json({success: false, msg: 'Password validation error', error: err.errors.password.kind});
            }
        } else if (err) {
            console.log(err)
            return res.json({success: false, msg: 'Validation error', error: err});
        } else {
            res.json({status: 200, message : 'You have succesfully registered.'});
        }
      });
    } else {
      return res.json({success: false, msg: validatedSignup, reason: "Wrong format"});
    }
  }
});

router.post('/login', (req, res) => {
  var loginData = req.body;
  var sanitizedLoginData = {};
  for(var key in loginData) {
    sanitizedLoginData[key] = DOMPurify.sanitize(loginData[key]);
  }
  var validatedLogin = loginValidation.validate(
    sanitizedLoginData.email,
    sanitizedLoginData.password
  );
  var validatedLoginData = loginValidation.validatedLoginData;
  if (validatedLogin === true) {
    User.findOne({
      email: validatedLoginData.email
    }, (err, user) => {
      if (err) throw err;

      if (!user) {
        res.json({success: false, msg: 'Email not in use. If you are new, please signup', reason: 'No user found'});
      } else {
        user.comparePassword(validatedLoginData.password, (err, isMatch) => {
          if (isMatch && !err) {
            const payload = {
              sub: user._id
            };
            // If user is located and password is correct then create a token
            var token = jwt.sign(payload, config.secret, {
              expiresIn: 60*60*24 // 24hours
            });
            // Return information along with the token as a JSON
            //console.log(req.user);
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.json({success: false, msg: 'Wrong password. Please try again or click "Forgot password?" to reset it', reason: 'Wrong password'});
          }
        });
      }
    });
  }
});

router.get('/get_user', passport.authenticate('jwt', { session: false}), (req, res) => {
  var query = Cart.findOne({ userID: req.user._id });
  query.exec((err, cart) => {
    if (err) return err;

    if (!cart) {
      res.json({
        firstname: xssFilters.inHTMLData(req.user.first_name),
        cartLength: '0',
        isLoggedIn: true
      });
    }

    if (cart) {
      console.log(cart.cart_items.length);
      res.json({
        firstname: xssFilters.inHTMLData(req.user.first_name),
        cartLength: cart.cart_items.length,
        isLoggedIn: true
      });
    }
  });
});

module.exports = router;
