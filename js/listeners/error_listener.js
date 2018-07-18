
// Event listener for WebSocket connection error
module.exports = (client) => {

  // Listen on WebSocket connection error
  client.on('error', error => {
    console.error(error);
  });

}
