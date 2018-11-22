const xssFilters = require('xss-filters');
const strainValidation = require('../validation/strainValidation.js');
const createDompurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDompurify(window);
const validator = require("validator");
const strain = require('../models/strain');
const Cart = require('../models/cart');
const imageProc = require("../img_process/imageProcess");

exports.add_strain = (req, res, next) => {
  imageProc.processImage(req.file.path);
  var url = 'http://localhost:8080';
  var imageUrl = url + req.file.path;
  var imagePath = imageUrl.replace("uploads\\", '/');
  var newstrainData = req.body;
  var cleanstrainData = {};
  for(var key in newstrainData) {
    cleanstrainData[key] = DOMPurify.sanitize(newstrainData[key]);
    cleanstrainData[key] = validator.escape(cleanstrainData[key]);
  }
  var validatedstrain = strainValidation.validate(
    cleanstrainData.price
  );
  var validatedstrainData = strainValidation.validatedstrainData;
  var newStrain = new strain({
    name: cleanstrainData.name.toLowerCase(),
    price: validatedstrainData.price,
    description: cleanstrainData.description,
    type: cleanstrainData.type,
    image: imagePath
  });
  newStrain.save(err => {
    if (err) {
      res.json({success: false, message: "Something went wrong!"});
    } else {
      res.json({success: true, message: "New strain added successfully"});
    }
  })
}

exports.get_strains = (req, res) => {
  var query = strain.find({}).select('name price image _id');
  query.exec(function(err, strains) {
    if (err) return err;
    console.log("FETCHING STRAINS...")
    console.log(strains);
    res.json(strains);
    });
}

exports.search_strain = (req, res, next) => {
  console.log("called")
  if (req.body.name) {
    var query = strain.find({ name: req.body.name.toLowerCase() }).select('name price image _id');
    query.exec(function(err, strain) {
      if (err) {
        return err;
      }

      if (strain == '') {
        var errorCode = 1700;
        next(errorCode);
      } else {
        res.json(strain);
      }
    });
  }
}

exports.get_specific_strain = (req, res, next) => {
  if (req.params.strainId) {
    console.log(req.body.check);
    var query = strain.findById(req.params.strainId).select('name price image description type _id');
    query.exec(function(err, strain) {
      if (err) {
        return err;
      }

      if (!strain) {
        next(new Error('No searches found'), false);
      } else {
        checkCartItem(strain);
      }
    });
  }

  function checkCartItem(item) {
    var query = Cart.findOne({ userID: req.user._id });
    query.exec((err, cart) => {
      if (err) return err;

      if (!cart) {
        console.log("cart doesnt exist");
        res.json({ itemExistance: false, item: item });
      } else {
          checkCart(cart);
      }
    });

    function checkCart(cart) {
      console.log("CHECKING CART...");
      console.log(cart);
      console.log(item._id);
      Cart.findOne({'cart_items._id': item._id},
      function (err, strain) {
        if (strain) {
          console.log("Doc found");
          res.json({ itemExistance: true, item: item });
        } else {
          console.log("Doc not found");
          res.json({ itemExistance: false, item: item });
        }
      });
    }
  }
}

exports.edit_specific_strain = (req, res, next) => {
  if (req.params.strainId) {
    var query = strain.findById(req.params.strainId).select('name price image description type _id');
    query.exec(function(err, strain) {
      if (err) {
        return err;
      }

      if (!strain) {
        next(new Error('No searches found'), false);
      } else {
        console.log(strain);
        res.json(strain);
      }
    });
  }
}

exports.update_specific_strain = (req, res, next) => {
  console.log("reached me")
  if (req.params.strainId) {
    var data = { name: req.body.name, price: req.body.price, type: req.body.type, description: req.body.description }
    var query = strain.findByIdAndUpdate(req.params.strainId, data);
    query.exec(function(err, updatedStrain) {
      if (err) {
        return err;
      }

      if (!updatedStrain) {
        next(new Error('No strain found to update'), false);
      } else {
        res.json({message: 'Changes saved!'})
      }
    });
    console.log(req.body);
  }
}

exports.delete_strain = (req, res, next) => {
  if (req.params.strainId) {
    var query = strain.findByIdAndRemove(req.params.strainId);
    query.exec(function(err, strain) {
      if (err) {
        next(new Error('Could not delete'), false);
      } else {
        res.json({message: 'Successfully deleted!'});
      }
    });
  }
}
