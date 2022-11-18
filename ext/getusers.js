
const http = require('http')

function getusers() {
  return new Promise(function(resolve, reject) {
    let data = '';
    const req =  http.request({
      hostname: '127.0.0.1',
      port: global.port,
      method: 'OPTIONS',
      path: '/',
    }, (res) => {

      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
      res.on('error', function(err) {
        reject(err);
        });
    });
    req.on('error', function(err) {
      reject(err);
    })
    req.end()
  });
}

module.exports = getusers;
