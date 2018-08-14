
// Command for "//@bot"
module.exports = (message) => {

  let log = `Successful command reply to ${message.content}`;
  message.reply('_Beldum Beldum!_ \`(Hey there! Want to know more about Beldum-Bot? Type //info)\`')
  .then(console.log(log))
  .catch(console.error);
  return log;

}
