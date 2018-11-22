const createDompurify = require('dompurify');
const { JSDOM } = require('jsdom');
const validator = require('validator');
const User = require('../models/user');
const signupValidation = require('../validation/signupValidation');

const { window } = (new JSDOM(''));
const DOMPurify = createDompurify(window);

exports.register_user = (req, res, next) => {
  console.log('REQ BODY: ', req.body);
  const { body } = req;
  const cleanSignupData = {};
  const inputKeys = Object.keys(body);
  if (!body.email || !body.password) {
    next(13000);
  }
  if (!body.ageverification) {
    next(1800);
  }
  inputKeys.forEach((key) => {
    body[key] = DOMPurify.sanitize(body[key]);
    cleanSignupData[key] = validator.escape(body[key]);
  });
  console.log('CLEAN SIGNUP DATA: ', cleanSignupData);
  const validatedSignup = signupValidation.validate(cleanSignupData);
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
        next(err.code);
      }
      if (err && err.errors.email) {
        console.log(err);
        const errorCode = 1000;
        next(errorCode);
      }
      if (err && err.errors.first_name) {
        console.log(err);
        const errorCode = 1100;
        next(errorCode);
      }
      if (err && err.errors.password) {
        console.log(err);
        console.log(err);
        const errorCode = 1300;
        next(errorCode);
      }
      if (err) {
        console.log(err);
        next(err);
      }
      res.json({
        status: 200,
        message: 'You have succesfully registered.',
      });
    });
  } else {
    next(12000);
  }
};
