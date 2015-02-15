$(document).ready( function() {
  var sum = 0;

  console.log('orderPrice loaded')
  $("#orderForm input").change(function () {
    var multiplier = $(this).is(':checked') ? 1 : -1;
    sum += (multiplier * $(this).attr('price'))
    console.log(sum);
    $('#orderSum').text(sum.toString());
  })
});