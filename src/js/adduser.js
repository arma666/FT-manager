const { ipcRenderer } = require('electron')

export function adduserstart(u) {
  u.sort();
  for (var i in u) {
    $('.listu').append('<div class="btn btn-success w-100">'+u[i]+'</div>');
  }
  sort()
  $('.listu .btn').click(function () {
    clickuser($(this));
  })
}


export function adduser(n,d,log) {
  if (n.length!=0){
    for (var i in n) {
      log('User online: '+n[i])
      let div = $('<div class="btn btn-success w-100">'+n[i]+'</div>')
      div.click(function () {
        clickuser($(this));
      })
      $('.listu').append(div);
    }
  }

  if (d.length!=0) {
    for (var i in d) {
      if ($( ".listu .btn:contains('"+d[i]+"')" ).hasClass('btn-light')){
        $('#uname').text('Select user to connect');
        $('.ucard').hide();
      }
      $( ".listu .btn:contains('"+d[i]+"')" ).remove();
      log('User offline: '+d[i]);
    }
  }

  if ((n.length!=0) || (d.length!=0))
    sort()
}



function sort() {
  var mylist = $('.listu');
  var listitems = mylist.children('div').get();
  listitems.sort(function(a, b) {
     return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
  });
  $.each(listitems, function(index, item) {
     mylist.append(item);
  });
}

function clickuser(obj) {
  $('.listu .btn').removeClass("btn-light").addClass("btn-success");
  obj.removeClass("btn-success").addClass("btn-light");
  //change uname
  $('#uname').text(obj.text());
  ipcRenderer.send('getuser', obj.text())

}
