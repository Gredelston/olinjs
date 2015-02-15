function last(arr) {
  if (arr) {
    return arr[arr.length - 1];
  } else {
    return undefined;
  }
}

function decimalPlaces(number) {
  // Ripped from http://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
  return ((+number).toFixed(20)).replace(/^-?\d*\.?|0+$/g, '').length;
}

function sanitizeName (name) {
  return name.split(' ').join('');
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

$(document).ready(function() {
  console.log("Document ready");

  $('#add_section').append(addSection);

  // EDITING AN EXISTING INGREDIENT

  var edit_button_listener = function(event) {
    event.preventDefault();

    // var edit_button = $(this);
    var id = last($(this).attr('id').split('_'));
    var name = $("#name_"+id).text().trim();
    var price = $("#price_"+id).text().trim().slice(1); //remove $
    var stock = ($("#stock_"+id).attr("stock") === 'true');
    console.log("("+$.trim($("#stock_"+id).text()).trim()+")");
    console.log(stock);

    // edit_button.hide();
    $("#"+id).html("");

    $("#"+id).append(editForm(id, name, price, stock));

    $("#update_"+id).submit(function(event) {
      event.preventDefault();

      var inputsArray = $('#update_'+id+' :input').serializeArray();
      var name = sanitizeName(inputsArray[0].value);
      var price = sanitizePrice(inputsArray[1].value);
      var stock = inputsArray[2] ? true : false;
  
      $.post("update", {
        id: id,
        ingredientName: name,
        price: price,
        inStock: stock
      }, function(status, data) {
        $("#update_"+id).remove();
        // $("#"+id).html(ingredientLine(name, price, inStock, _id));
        // edit_button.show()
        $("#"+id).html(ingredientLine(name, price, stock, id));
        $("#edit_button_"+id).submit(edit_button_listener);
      });
    });    
  }

  $('.edit_button').submit(edit_button_listener);

  // ADDING A NEW INGREDIENT

  $('#add_button').submit(function(event) {
    event.preventDefault();
    $('#add_section').append(addForm);
    $('#add_button').hide();

    $('#add_send').submit(function(event) {
      event.preventDefault();

      var inputsArray = $('#add_send :input').serializeArray();
      var name = sanitizeName(inputsArray[0].value);
      var price = sanitizePrice(inputsArray[1].value);

      $.post("add_send", {
        ingredientName: name,
        price: price,
      }, function (data, status) {
        var id = data;
        $('#add_section').before(newIngredientLine(name, price, true, id));
        $('#edit_button_'+id).submit(edit_button_listener);
      });

      $('#add_send').remove();
      $('#add_button').show();
    });

  });
});