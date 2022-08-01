import { log } from './js/log.js';
import { adduser,adduserstart } from './js/adduser.js';
const { ipcRenderer } = require('electron')
$(function() {
  $('#saveconfig').on('click',function () {
    $('#mymod').modal('hide');
    $('.listu').empty();
    let conf = {
      host: $('#host').val(),
      user: $('#user').val(),
      pass: $('#pass').val(),
      port: $('#port').val()
    }
    ipcRenderer.send('sendconfig', conf);
  })

  ipcRenderer.on('getconfig', (event, arg) => {
    $('#host').val(arg.host)
    $('#user').val(arg.user)
    $('#pass').val(arg.pass)
    $('#port').val(arg.port)
    })
  ipcRenderer.on('configsaved', (event, arg) => {
    ipcRenderer.send('status', 'ready')
  })
  ipcRenderer.on('noconfig', (event, arg) => {
    $('#mymod').modal('show');
  })
  $('#connect').on('click', connect)
  log('Started. Connect to backend')
  log('Send HI')
  ipcRenderer.send('status', 'ready')
  ipcRenderer.on('asynchronous-reply', (event, arg) => {
    log(arg)
  })
  ipcRenderer.on('log', (event, arg) => {
    log(arg)
  })
  ipcRenderer.on('usersstart', (event, arg) => {
    adduserstart(JSON.parse(arg))
  })
  ipcRenderer.on('monitor', (event, arg) => {
    let n = JSON.parse(arg)[0];
    let d = JSON.parse(arg)[1];
    adduser(n, d, log);
  })
  ipcRenderer.on('userinfo', (event, arg) => {
    $('#uinfo').text(arg);
    $('.ucard').show();
  })
})

function connect() {
  ipcRenderer.send('connect', $('#uname').text())
}
