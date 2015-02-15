var addForm = '' +
  '<form id="add_send">' +
  '  <input type="text" class="add" id="addName" name="name" value="Ingredient name">' +
  '  <input type="text" class="add" id="addPrice" name="price" value="0.00">' +
  '  <input type="submit" class="add" submit="Add item">' +
  '</form>';

var addSection = '' +
 ' <form id="add_button">' +
 '   <input type="submit" value="Add new item">' +
 ' </form>';

var checkIt = function(bool) {
  if (bool) {
    return " checked";
  } else {
    return "";
  }
}

var editForm = function (id,name,price,inStock) {
  return '' +
  '<form id="update_'+id+'">' +
  '  <input type="text" name="name" value="'+name+'">' +
  '  <input type="text" name="price" value="'+price+'">' +
  '  In-stock: <input type="checkbox" name="stock"'+checkIt(inStock)+'>' +
  '  <input type="submit" value="Confirm">' +
  '</form>';
}

var ingredientLine = function(name, price, inStock, id) {
  return   ''+
  '  <span id="name_'+id+'">' +
       name +
  '</span>' +
  ' -- ' +
  '  <span id="price_'+id+'">' +
       currency(Number(price)) +
  '</span>' +
  '' +
  '  (In-stock:' +
  '  <span id="stock_'+id+'" stock='+inStock+'>' +
       inStock.toString() +
  '<span>' +
  '  )' +
  '' +
  '  <form class="edit_button" id="edit_button_'+id+'">' +
  '   <input type="submit" value="Edit item">' +
  '  </form>'
}

var ingredientLIPrefix = function(id) {
	return '<li id="'+id+'">';
}
var ingredientLISuffix = '</li>';

var newIngredientLine = function(name, price, inStock, id) {
	return ingredientLIPrefix(id) +
		   ingredientLine(name, price, inStock, id) +
		   ingredientLISuffix;
}

var ingredientEdit = function(name, price, inStock, id) {
  return  ''+
  '<form class="edit_send" id="edit_send_'+id+'">'+
  '  <span id="name_'+id+'">' +
  '     <input type="text" name="name" value="'+name+'">' +
  '  </span>' +
  ' -- ' +
  '  <span id="name_'+id+'">' +
  '     <input type="text" name="name" value="'+currency(Number(price))+'">' +
  '  </span>' +
  '' +
  '  (In-stock:' +
  '  <span id="stock_'+id+'">' +
  '     <input type="checkbox" name="outOfStock" value="'+!inStock+'">' +
  '  <span>' +
  '  )' +
  '' +
  '   <input type="submit" value="Edit item">' +
  '  </form>';
}

var currency = function(amt) {
  if (amt === Math.round(amt)) {
    return "$" + amt.toString() + ".00";
  } else if (amt*10 === Math.round(amt*10)) {
    return "$" + amt.toString() + "0";
  } else {
    return "$" + amt.toString();
  }
};