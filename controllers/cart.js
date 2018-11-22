const Cart = require('../models/cart');
const passport = require('passport');
const Strain = require('../models/strain');
const mongoose = require('mongoose');
const ExtractJwt = require('passport-jwt').ExtractJwt;

exports.update_cart = (req, res, next) => {
  var query = Cart.findOne({ userID: req.user._id });
  query.exec((err, cart) => {
    if (err) return err;

    if (!cart) {
      var newCart = new Cart({
        userID: req.user._id,
        cart_items: { _id: req.body.productId, product: { productID : req.body.productId }}
      });
      newCart.save(err => {
        if (err) {
          console.log(err);
        }
        // console.log("NEW CART ADDED");
        // console.log("FETCHING CART LENGTH...");
        fetchCartLength();
      });
    } else {
        updateCart(cart);
    }
  });

  function updateCart(cart) {
    console.log("UPDATING CART...");
    var cartID = cart._id;
    var cart_itemsID = cart.cart_items[0]._id;
    var newProduct = { _id: req.body.productId, product: { productID : req.body.productId }};
    Cart.findOneAndUpdate(
      { "_id": cartID, "cart_items._id": cart_itemsID }, { $push:
        {'cart_items' : newProduct}
      }, {upsert: true}, function(err, doc) {
        if (err) {
          console.log("something went wrong");
          console.log(err);
        }
        fetchCartLength();
    });
  }

  function fetchCartLength() {
    var query = Cart.findOne({ userID: req.user._id });
    query.exec((err, cart) => {
      if (err) return err;

      if (cart) {
        // console.log("CART LENGTH: " + cart.cart_items.length);
        res.json({ cartLength: cart.cart_items.length, itemExistance: true });
      }
    });
  }
}

exports.get_cart = (req, res, next) => {
  var query = Cart.findOne({ userID: req.user._id });
  query.exec((err, cart) => {
    if (err) return err;

    if (cart) {
      // console.log("getting cart items");
      var cartItems = cart.cart_items;
      var cartItemsID = [];
      // for(var key in cartItems.product) {
      //   cartItemsID[key] = cartItems[key].product.productID;
      // }
      cartItems.forEach(function(item) {
        cartItemsID.push(item.product.productID);
      });
      // console.log(cartItemsID);
      getCartItems(cartItemsID);
      // res.json({ message: 'dummy' });
      // getCartItems(cart.cart_items[0].product.productID)
    }
  });

  function getCartItems(items) {
    var query = Strain.find({'_id': {$in: items}}).select('name price image _id');
    query.exec((err, items) => {
      if (err) {
        console.log(err);
      }
      if (items) {
        // console.log("cart items");
        // console.log(items);
        res.json(items);
      }
    });
  }
}

exports.remove_cart_item = (req, res, next) => {
  console.log("reached me");
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  console.log(opts);
  res.json({ message: 'hello' });
  // if (req.user._id) {
  //   var query = Cart.findOne({ userID: req.user._id });
  //   query.exec((err, cart) => {
  //     if (err) return err;
  //
  //     if (cart) {
  //       // next(cart);
  //       res.json({ message: 'reached' });
  //     }
  //   })
  // }

  // if (req.params.strainId) {
  //   var query = strain.findByIdAndRemove(req.params.strainId);
  //   query.exec(function(err, strain) {
  //     if (err) {
  //       next(new Error('Could not delete'), false);
  //     } else {
  //       res.json({message: 'Successfully deleted!'});
  //     }
  //   });
  // }

}
