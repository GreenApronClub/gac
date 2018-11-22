const xssFilters = require('xss-filters');
const User = require('../models/user');
const signupValidation = require('../validation/signupValidation.js');
const createDompurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDompurify(window);
const validator = require("validator");

exports.register_user = (req, res, next) => {
  var signupData = req.body;
  console.log(req.body.email)
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
        if (err && err.code) {
          next(err.code, false);
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
            res.json({status: 200, msg : 'You have been succesfully registered! Please proceed to login.'});
        }
      });
    } else {
      console.log("something went wrong");
      next(validatedSignup);
    }
  }
}
