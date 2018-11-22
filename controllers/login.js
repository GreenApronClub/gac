const passport = require('passport');
require('../config/passport')(passport);
const config = require('../config/database');
const jwt = require('jsonwebtoken');
const xssFilters = require('xss-filters');
const User = require('../models/user');
const loginValidation = require('../validation/loginValidation.js');
const createDompurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDompurify(window);
const validator = require("validator");

exports.login_user = (req, res, next) => {
  console.log("reached");
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
        next(1500);
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
            res.json({isLoggedIn: true, token: 'JWT ' + token});
          } else {
            next(1600);
          }
        });
      }
    });
  }
}
