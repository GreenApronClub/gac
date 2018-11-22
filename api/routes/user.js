const passport = require('passport');
const config = require('../../config/database');
require('../../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const xssFilters = require('xss-filters');
const validator = require("validator");
const Cart = require('../../models/cart');


router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
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
