const log = require('loglevel');
require('dotenv').config()

// Logger: error > warn > info > debug > trace
if (process.env.LIVE) log.setDefaultLevel(log.levels.INFO);
else log.setDefaultLevel(log.levels.TRACE);

module.exports = {
  // Get my global logger
  getLogger() {
    return log;
  }
}
