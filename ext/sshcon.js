const openSshTunnel = require('open-ssh-tunnel');
function openATunnel(port, dport) {
  return new Promise(function(resolve, reject) {
  const config = require('../src/config.json');
  const server = openSshTunnel({
    host: config.host,
    username: config.user,
    port: config.port,
    password: config.pass,
    srcPort: dport,
    srcAddr: '127.0.0.1',
    dstPort: dport,
    dstAddr: '127.0.0.1',
    readyTimeout: 10000,
    forwardTimeout: 10000,
    localPort: port,
    localAddr: '127.0.0.1'
  }, function(error, clientConnection) {
      reject(error);
  });
  resolve(server);
});
}



module.exports = openATunnel;

/*


  openATunnel().then(
      function (result) {
        console.log('wdwd');
        //park()
      },
      error => console.log('efef')
  )

  function parkx() {
    console.log('wadwdwd');
  }

/*
function park() {
  jobj = JSON.stringify({
                'ip': '1.1.1.1',
                'name': '5555',
                'pass': '123456'
              })
  const req = http.request({
    hostname: '127.0.0.1',
    port: 15487,
    method: 'POST',
    path: '/',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': jobj.length
    }
  }, (res) => {
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    })
  });

  req.write(jobj);
  req.end()
}
*/
