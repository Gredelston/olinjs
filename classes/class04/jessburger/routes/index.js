var url = require('url');
var path = require('path');
var mg_models = require('./mg_models');

var Ingredient = mg_models.Ingredient;
var Order = mg_models.Order;

// GET functions

var home = function(req, res) {
  res.render('home');
};

var ingredients = function(req, res){
  // TODO: Add EDIT functionality
  Ingredient.find()
    .exec(function (err, ings) { 
      res.render('ingredients', {ings: ings});
    });
};

var order = function(req, res){
  Ingredient.find({ inStock: true }, function (err, docs) {
    res.render('order', {ings: docs});
  })
};

var kitchen = function(req, res){
  console.log("Rerendering the kitchen");
  Order.find( {completed: false} )
    .exec(function (err, orders) {
      res.render('kitchen', {orders: orders});
    });
};

// POST methods

var postOrder = function(req, res) {
  console.log(req.body);
  var order = new Order({
    ingredients: Object.keys(req.body),
    completed: false
  });
  order.save(function (err) {
    if (err) {
      console.log("Problem saving order: ", err);
      res.render('orderDenied');
    } else {
      console.log("Order saved!", req.body);
      res.render('orderConfirmed');
    }
  });
}

function last(arr) {
  if (arr) {
    return arr[arr.length - 1];
  } else {
    return undefined;
  }
}

var completeOrder = function(req, res) {
  /* *
   * okay this is kind of unfortunate
   * but if you try to chain complete requests
   * then the stupid URL becomes so long
   * like friggin /completeOrder/completeOrder/completeOrder/_id
   * and uh that's fugly but not technically a problem
   * but that's why my id query is so wonk
   **/
  var id = last(req.params['0'].split('/'));

  Order.update(
    { _id: id },
    { completed: true },
    function (err, numberAffected, rawResponse) {
      if (err || !numberAffected) {
        console.log("Failed to locate order with id:", id);
      } else {
        console.log(order);
        kitchen(req, res);
      }
    });
} 

var editIngredient = function (req, res) {
  var id = last(req.params['0'].split('/'));

  Ingredient.findOne( {_id: id} )
    .exec(function (err, ing) {
    });
}

var updateIngredient = function (req, res) {
  var id = req.body.id;
  console.log("ID ID ID ID (" + id + ")");
  var name = req.body.ingredientName;
  var price = req.body.price;
  var inStock = req.body.inStock;

  Ingredient.findOne({ _id: id }, function (err, doc) {
      if (err) {
        console.log("Error finding ingredient: ", err);
        return;
      }
      doc.name = name;
      doc.price = price;
      doc.inStock = inStock;
      doc.save();
      res.end();
    })
}

function sanitizeName (name) {
  return name.replace(' ','');
}

function sanitizePrice (price) {
  if (isNaN(price)) {
    return 0;
  } else if (decimalPlaces(price) > 2) {
    return Math.round(price*100)/100;
  } else {
    return price;
  }
}

var addSend = function(req, res) {
  console.log("CALLED")
  console.log(req.body)
  var name = req.body.ingredientName;
  var price = req.body.price;
  var inStock = true;
  var ingredient = Ingredient( {name: name, price: price, inStock: inStock} );
  ingredient.save(function (err) {
      if (err) {
        console.log("Error logging ingredient", err)
      }
      console.log("SERVER ID: ", ingredient._id)
      res.send(ingredient._id)
    })
}

module.exports.home = home;
module.exports.ingredients = ingredients;
module.exports.order = order;
module.exports.kitchen = kitchen;

module.exports.postOrder = postOrder;
module.exports.completeOrder = completeOrder;
module.exports.editIngredient = editIngredient;
module.exports.updateIngredient = updateIngredient;
module.exports.addSend = addSend;