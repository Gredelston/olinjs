var express = require('express');
var path = require('path');
var logger = require('morgan'); // even though it's a rum, not a lager
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var index  = require('./routes/index');

var app = express();

var currency = function(amt) {
  if (amt === Math.round(amt)) {
    return "$" + amt.toString() + ".00";
  } else if (amt*10 === Math.round(amt*10)) {
    return "$" + amt.toString() + "0";
  } else {
    return "$" + amt.toString();
  }
};

var disabledItem = function(item) {
  if (item.inStock) {
    return "";
  } else {
    return " disabled";
  }
};

app.engine('.hbs', exphbs({extname: '.hbs',
  defaultLayout: 'main',
  helpers: {currency: currency, disabledItem: disabledItem} }));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.home);
app.get('/ingredients', index.ingredients);
app.get('/order', index.order);
app.get('/kitchen', index.kitchen);

app.post('/postOrder', index.postOrder);
app.post('/completeOrder/*', index.completeOrder);
app.post('/update', index.updateIngredient);
app.post('/add_send', index.addSend);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});
