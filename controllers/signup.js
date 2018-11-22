const createDompurify = require('dompurify');
const { JSDOM } = require('jsdom');
const validator = require('validator');
const User = require('../models/user');
const signupValidation = require('../validation/signupValidation');

const { window } = (new JSDOM(''));
const DOMPurify = createDompurify(window);

exports.register_user = (req, res, next) => {
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
  signupValidation.validate(cleanSignupData, (validationErrCode, data) => {
    if (validationErrCode) {
      next(validationErrCode);
    } else {
      console.log('DATA: ', data.email);
      const newUser = new User({
        password: data.password,
        first_name: data.firstname,
        last_name: data.lastname,
        age_verification: data.ageverification,
        email: data.email,
      });
      newUser.save((err) => {
        console.log('NEWUSER ERR: ', err);
        if (err && err.code === 11000) {
          console.log(err.code);
          next(err.code);
        }
        if (err && err.errors.email) {
          console.log(err);
          next(1000);
        }
        if (err && err.errors.first_name) {
          console.log(err);
          next(1100);
        }
        if (err && err.errors.password) {
          console.log(err);
          next(1300);
        }
        if (err) {
          console.log(err);
          next(err);
        }
        res.status(200);
        res.json({ message: 'You have succesfully registered.' });
      });
    }
  });
};
