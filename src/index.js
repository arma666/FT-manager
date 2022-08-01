import { app, BrowserWindow, ipcMain, Notification, dialog  } from 'electron';
const path = require('path');
const sshtun = require('../ext/sshcon.js');
const chport = require('../ext/chport.js');
const run = require('../ext/run.js');
const runssh = require('../ext/runssh.js');
const getusers = require('../ext/getusers.js');
const log = require('../ext/log.js');
//const getconfig = require('../ext/getconfig.js');
const process = require('process');
const fs = require('fs');
app.allowRendererProcessReuse = true;

dialog.showErrorBox = function(title, content) {
    console.log(`${title}\n${content}`);
};




var users, usernames=[], usernames2=[], ipt=[], lport=16000, serverLink;


ipcMain.on('connect', (event, arg) => {
  ipt = [];
  log(event,'Connect to '+arg+', test local ip' )
  for (var i in users) {
    if(users[i].name==arg){
      var uobj = users[i];
      var ip = users[i].ip;
      var dport = i;
      //check local ip
      for (var x in ip) {
        if (ip[x].includes('192.168.')){
          ipt.unshift(ip[x]);
        }
        else {
          ipt.push(ip[x]);
        }
      }
    }

  }
  testport(ipt, event, arg, uobj, dport);
})

function testport(ipt, event, user, uobj, dport) {
  if (ipt.length!=0){
    log(event,'Test connect ot local: '+ipt[0]+':5900' )
    chport(ipt[0],5900).then(is => {
      if (is) {
        log(event, 'Port is open - connecting local' )
        connect(ipt[0], 5900, uobj)
      }
      else {
        log(event, 'Nope' )
        ipt.shift();
        var newips = ipt;
        console.log(ipt);
        testport(newips, event, user,uobj, dport)
      }
    })
  }
  else {
    log(event, 'No local opened ports. Create tunel...' )
    createTun(uobj,lport, dport)
    lport++;
  }
}


function createTun(uobj,port,dport) {
    sshtun(port,dport).then(server => {
      setTimeout(runsshf, 1000, port,uobj.pass,server)
    })
}

function runsshf(port,pass,server) {
  runssh('vncviewer.exe 127.0.0.1:'+port+' /password '+pass,server)
}


function connect(host,port,uobj) {
  console.log('running');
  run('vncviewer.exe '+host+':'+port+' /password '+uobj.pass)
}

ipcMain.on('sendconfig', (event, conf) => {
  fs.writeFile(__dirname +'/config.json', JSON.stringify(conf), (err) => {
    if (err) throw err;
    if (serverLink) {
      serverLink.close()
    }
    event.reply('configsaved')

  });
})



ipcMain.on('status', (event, arg) => {
  if (arg=='ready') {
    //get config
    let getconfig = require('../ext/getconfig.js');
    getconfig().then(res => {
      if (res.is){
        //send config to front
        event.reply('getconfig', res.conf)
        start(event)
        log(event,'Connecting to server...')
      }
      else {
        event.reply('noconfig')
        log(event,'No config. request...')
      }
    })
  }
})

ipcMain.on('getuser', (event, arg) => {
  console.log('select user', arg)
  for (var i in users) {
    if(users[i].name==arg){
        event.reply('userinfo', JSON.stringify(users[i]));
    }
  }
})


function start(event) {
  sshtun(15487,8080).then(server => {
    log(event,'Connected to ssh server. Get user-list')
    serverLink = server
    console.log(serverLink);
    getuser(server,event);
  },
  error => {
    log(event,'cant connect. Reconnect...')
    if (!(serverLink))
      setTimeout(start,2000,event)
  })
}

function getuser(server,event) {
  getusers().then(data =>{
    users = JSON.parse(data)[0];
    parsusers();
    log(event,'Users loaded')
    event.reply('usersstart', JSON.stringify(usernames));
    setTimeout(monitor, 5000, server,event);

  })
  .catch(function(e){
    server.close();
    log(event,'can\'t get users. Reconnect in 5s... ')
    setTimeout(start,5000,event)
  })
}



function monitor(server,event) {

  getusers().then(data =>{
    //console.log(data);
    users = JSON.parse(data)[0];
    parsusers2();
    event.reply('monitor', JSON.stringify(chekdif()));
    setTimeout(monitor, 5000, server,event);

  })
  .catch(function(e){
    console.log(e);
   server.close();
    log(event,'can\'t get users. Reconnect in 5s... ')
    setTimeout(start,1000,event)
  })

}


function chekdif() {
  var newuser = usernames2.filter(x => usernames.indexOf(x) === -1);
  var deluser = usernames.filter(x => usernames2.indexOf(x) === -1);
  usernames = usernames2;
  showNotification(newuser,deluser)
  return [newuser,deluser]
}


function parsusers() {
  for (var i in users) {
    if(users[i].name!='hiden')
      usernames.push(users[i].name)
  }
}
function parsusers2() {
  usernames2 = [];
  for (var i in users) {
    if(users[i].name!='hiden')
      usernames2.push(users[i].name)
  }
}




function showNotification (newuser,deluser) {
  for (var i in newuser) {
    const notification = {
      title: 'User online',
      body: newuser[i]
    }
    new Notification(notification).show()
  }

  for (var i in deluser) {
    const notification = {
      title: 'User offline',
      body: deluser[i]
    }
    new Notification(notification).show()
  }
}



if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    width: 800,
    height: 600,
    icon:'ico2.ico',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    },
  });


  mainWindow.loadURL(path.join(__dirname, '/index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};


app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
