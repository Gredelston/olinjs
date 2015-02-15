var mongoose = require('mongoose');

var mongoURI = process.env.MONGOURI || "mongodb://burgeruser:burger@ds039411.mongolab.com:39411/olinjs";
mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Successfully opened mongo database: ', mongoURI);
});

var ingredientSchema = mongoose.Schema({
  name: String,
  price: Number,
  inStock: Boolean
});
var Ingredient = mongoose.model('Ingredient', ingredientSchema);

var orderSchema = mongoose.Schema({
  ingredients: [String],
  completed: Boolean
});
var Order = mongoose.model('Order', orderSchema);

var addCat = function() {
  var catName = choose(firstNames) + ' ' + choose(lastNames);
  var catColors = pickColors();
  var catAge = Math.floor(Math.random() * 18) + 1;

  var cat = new Cat({name: catName, age: catAge, colors: catColors});

  cat.save(function (err) {
    if (err) {
      console.log("Problem saving cat", err);
    }
  });

  return catToString(cat);
}

function catToString(cat) {
  return cat.name + 
         ' the ' +
         cat.age.toString() +
         '-year-old, '
         + cat.colors.join(' and ') +
         ' colored cat';
}

function catsByColor(res, color) {
  console.log("HELLO" + color);
  Cat.find( { colors: color } )
    .exec(function (err, cats) {
      // Once the cats have been found,
      // render them.
      cats = cats.map(catToString);
      res.render('byColor', {'color': color, 'cats': cats});
    });
}

function allCats(res) {
  Cat.find()
    .sort({age: 'asc'})
    .exec(function (err, cats) {
      cats = cats.map(catToString);
      res.render('byColor', {'cats': cats})
    });
}

function deleteOldest(res) {
  Cat.find()
    .sort({age: 'desc'})
    .exec(function (err, cats) {
      if (cats.length === 0) {
        res.render('deleteOldest', {cat: 'nobody at all'});
        return;
      }

      cat = cats[0];
      console.log(cat)
      var catStr = catToString(cat);
      //Cat.remove({_id: cat._id});
      cat.remove()
      res.render('deleteOldest', {cat: catStr}); 
    });
}

module.exports.Ingredient = Ingredient;
module.exports.Order = Order;
