const validator = require('validator');

exports.validate = (formData, callback) => {
  const validatedSignupData = {};
  const {
    email,
    firstname,
    lastname,
    password,
    ageverification,
  } = formData;
  console.log('FORM DATA: ', formData);
  if (validator.isEmail(email)) {
    validatedSignupData.email = email;
  } else {
    callback(1000);
  }
  if (validator.isAlpha(firstname)) {
    validatedSignupData.firstname = firstname;
  } else {
    callback(1100);
  }
  if (validator.isAlpha(lastname)) {
    validatedSignupData.lastname = lastname;
  } else {
    callback(1200);
  }
  if (validator.isAlphanumeric(password)) {
    validatedSignupData.password = password;
  } else {
    callback(1300);
  }
  if (validator.isBoolean(ageverification)) {
    validatedSignupData.ageverification = ageverification;
  } else {
    callback(1400);
  }
  callback(null, validatedSignupData);
};
