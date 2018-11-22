const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

// Define schema for user model
const { Schema } = mongoose;
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    maxlength: 62,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  first_name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  last_name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  address: {
    type: String,
  },
  address_2: {
    type: String,
  },
  city: {
    type: String,
  },
  zip_code: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  age_verification: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', (next) => {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) {
        next(saltErr);
      }
      bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
        if (hashErr) {
          next(hashErr);
        }
        user.password = hash;
        next();
      });
    });
    next();
  }
});

UserSchema.methods.comparePassword = (passw, cb) => {
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if (err) {
      cb(err);
    }
    cb(null, isMatch);
  });
};
// Create user model
module.exports = mongoose.model('User', UserSchema);
