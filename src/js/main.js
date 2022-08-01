
$(function() {

  $('#search').on('keyup search', function () {
    var vali = $(this).val();
    $('.listu .btn').each(function () {
      if($(this).text().toLowerCase().includes(vali.toLowerCase())){
        $(this).show();
      }
      else {
        $(this).hide();
      }
    })
  })
  $('.ucard').hide();

});
