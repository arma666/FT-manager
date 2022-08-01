function run(cmd) {
  var exec = require('child_process').exec;
  exec(__dirname+'\\'+cmd, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.log(err);
    return;
  }

  // the *entire* stdout and stderr (buffered)
  //console.log(`stdout: ${stdout}`);
  //console.log(`stderr: ${stderr}`);
});
}

//run(__dirname+'\\vncviewer.exe 172.27.184.9:5900 /password b26bdbpc')

module.exports = run;
