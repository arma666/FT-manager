import { access, constants } from 'fs';

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

function getconfig() {
  console.log('------------');
  return new Promise(function(resolve, reject) {
    access('src/config.json', constants.F_OK, (err) => {
      if (err == null){
        resolve({
          is: true,
          conf: requireUncached('../src/config.json')
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
