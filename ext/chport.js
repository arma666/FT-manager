const log = require('./log.js');

const isPortReachable = require('is-port-reachable');

function chport(host,port) {
  return new Promise(function(resolve, reject) {
    resolve(isPortReachable(port, {host: host, timeout: 500}))
  })
}


module.exports = chport;
