

export function log(text) {
  const date = new Date();
  let month = (parseInt(date.getMonth())+1)>9 ? (parseInt(date.getMonth())+1) : '0'+(parseInt(date.getMonth())+1) ;
  let day = date.getDate()>9 ? date.getDate() : '0'+date.getDate();
  let year = date.getFullYear();
  let hour= date.getHours();
  let min = date.getMinutes()>9 ? date.getMinutes() : '0'+date.getMinutes() ;
  let sec = date.getSeconds()>9 ? date.getSeconds() : '0'+date.getSeconds() ;
  const d = day+'.'+month+'.'+year+' - '+hour+':'+min+':'+sec
  $('.log').val(d+'> '+text+'\n'+$('.log').val())
}
