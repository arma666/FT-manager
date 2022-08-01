//require('console-lt').overwrite();
function log(event,text) {
  console.log(text);
  event.reply('log',text)
}
module.exports = log;
