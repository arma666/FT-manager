import { access, constants } from 'fs';

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

function getconfig() {
  return new Promise(function(resolve, reject) {
    access(global.appRoot +'/config.json', constants.F_OK, (err) => {
      if (err == null){
        resolve({
          is: true,
          conf: requireUncached(global.appRoot +'/config.json')
        })
      } else {
        console.log(err);
        resolve({
          is: false
        })
      }
    })

  })
}


module.exports = getconfig;
/*
resolve({
  is: true,
  conf: require('../config.json')
})
*/
