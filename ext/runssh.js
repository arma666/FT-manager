function run(cmd, server) {
  console.log(cmd);
  var exec = require('child_process').exec;
  var p = exec(__dirname+'\\'+cmd, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      //console.log(err);
      return;
    }

  });
  p.on('exit', function() {
    console.log('process exit');
    server.close();
  })
}


module.exports = run;
