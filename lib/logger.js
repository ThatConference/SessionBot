const Winston  = require('winston')
const GCloudTransport = require('@google-cloud/logging-winston')

let logger = new (Winston.Logger)({
  levels: {
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
  },
  colors: {
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
  }
})

logger.add(GCloudTransport, {
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: require(process.env.GCLOUD_KEYFILE),
  key: process.env.GCLOUD_APIKEY,
  level: 'info'
})

module.exports = logger
