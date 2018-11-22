var mongoose  = require("mongoose"),
    bcrypt   = require("bcrypt-nodejs");

// Define schema for user model
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  email: {
      type: String,
      unique: true,
      required: true,
      maxlength: 62
  },
  password: {
      type: String,
      required: true,
      minlength: 8
  },
  first_name: {
      type: String,
      required: true,
      maxlength: 50
  },
  last_name: {
      type: String,
      required: true,
      maxlength: 50
  },
  address: {
      type: String,

  },
  address_2: {
      type: String
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
      required: true
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};



// Create user model
module.exports = mongoose.model("User", UserSchema);
