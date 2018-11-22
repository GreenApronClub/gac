import passport from 'passport';
import { router } from 'express';
import jwt from 'jsonwebtoken';
import xssFilters from 'xss-filters';
import createDompurify from 'dompurify';
import { JSDOM } from 'jsdom';
import validator from 'validator';
import config from '../../config/database';
import Stock from '../../models/stock';
import Cart from '../../models/cart';
import User from '../../models/user';
import signupValidation from '../../validation/signupValidation';
import loginValidation from '../../validation/loginValidation';
import stockValidation from '../../validation/stockValidation';

require('../config/passport')(passport);

const { window } = new JSDOM('');
const DOMPurify = createDompurify(window);

router.post('/new_strain', (req, res) => {
  const newStockData = req.body;
  const cleanStockData = {};
  for(var key in newStockData) {
    cleanStockData[key] = DOMPurify.sanitize(newStockData[key]);
    cleanStockData[key] = validator.escape(cleanStockData[key]);
  }
  const { validatedStockData } = stockValidation;
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

router.post('/signup', (req, res, next) => {
  const { signupData } = req.body;
  const cleanSignupData = {};
  if (!signupData.email || !signupData.password) {
    return res.json({
      success: false,
      msg: 'Please enter an email and a password.',
    });
  }
  if (!signupData.ageverification) {
    const errorCode = 1800;
    next(errorCode);
  }
  for (var key in signupData) {
    cleanSignupData[key] = DOMPurify.sanitize(signupData[key]);
    cleanSignupData[key] = validator.escape(cleanSignupData[key]);
  }
  const validatedSignup = signupValidation.validate(
    cleanSignupData.email,
    cleanSignupData.firstname,
    cleanSignupData.lastname,
    cleanSignupData.password,
    cleanSignupData.address,
    cleanSignupData.address2,
    cleanSignupData.city,
    cleanSignupData.zipcode,
    cleanSignupData.phonenumber,
    cleanSignupData.ageverification,
  );
  const { validatedSignupData } = signupValidation;
  if (validatedSignup === true) {
    const newUser = new User({
      email: validatedSignupData.email,
      password: validatedSignupData.password,
      first_name: validatedSignupData.firstName,
      last_name: validatedSignupData.lastName,
      address: validatedSignupData.address,
      address2: validatedSignupData.address2,
      city: validatedSignupData.city,
      zip_code: validatedSignupData.zipCode,
      phone_number: validatedSignupData.phoneNumber,
      age_verification: validatedSignupData.ageVerification,
    });
    newUser.save((err) => {
      if (err && err.code === 11000) {
        console.log(err.code);
        return res.json({
          success: false,
          msg: 'The email provided is already in use.',
          reason: 'Email already in use',
          error: err,
        });
      }
      if (err && err.errors.email) {
        console.log(err);
        return res.json({
          success: false,
          msg: 'Email validation error',
          error: err.errors.email.kind,
        });
      }
      if (err && err.errors.first_name) {
        console.log(err);
        return res.json({
          success: false,
          msg: 'First name validation error',
          error: err.errors.first_name.kind,
        });
      }
      if (err && err.errors.password) {
        console.log(err);
        if (err.errors.password.kind === 'minlength') {
          return res.json({
            success: false,
            msg: 'Password must be at least 8 characters long',
            error: err.errors.password.kind,
          });
        }
        return res.json({
          success: false,
          msg: 'Password validation error',
          error: err.errors.password.kind,
        });
      }
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          msg: 'Validation error',
          error: err,
        });
      }
      return res.json({
        status: 200,
        message: 'You have succesfully registered.',
      });
    });
  }
  return res.json({
    success: false,
    msg: validatedSignup,
    reason: 'Wrong format',
  });
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
