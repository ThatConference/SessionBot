require('dotenv').config()

const Request = require('request')
const logger = require('./lib/logger')

const SLACK_URL = process.env.SLACK_URL
logger.debug(`SLACK_URL: ${SLACK_URL}`)

const headers = {
    'Content-Type': 'application/json'
}

let options = {
    url: SLACK_URL,
    method: 'POST',
    headers: headers,
    body: ''
}

let postPayload = {
  channel: '#session_updates',
  username: 'ThatBot',
  text: '',
  icon_emoji: ':that:'
}

exports.sessionUpdated = (req, res) => {
  logger.info(`Session Updated Message Called`)

  return Promise.resolve()
   .then(() => {
     if (req.method !== 'POST') {
       const error = new Error('Only POST requests are accepted');
       error.code = 405;

       logger.error(`Non Post Method Recieved: ${req.method}`)
       throw error;
     }

      const message = req.body
      const slackMessage = buildSlackMessage(message)
      logger.debug(`Formatted Slack Message: \n ${JSON.stringify(slackMessage)}`)

      postPayload.text = slackMessage.text
      postPayload.attachments = slackMessage.attachments

      //logger.info(`Slack Payload: ${JSON.stringify(postPayload)}`)
      options.body = JSON.stringify(postPayload)

      //logger.info(`Sending Message To Slack`)
      Request(options, (error, response, body) => {
        logger.debug(`Slack Response Code: ${response.statusCode}`)
        logger.debug(`Request Body Recieved: \n ${body}`)

       if (!error && response.statusCode == 200) {
          logger.info(`Message Relayed To Slack`)

          res.status(response.statusCode)
          res.send('Message Relayed to Slack');
         }
         res.end();
      })

    })
    .catch((err) => {
      logger.error(err);
      const code = err.code || (err.response ? err.response.statusCode : 500) || 500;
      res.status(code).send(err);
      return Promise.reject(err);
    });
}

exports.sessionCancelled = (req, res) => {

}

const buildSlackMessage = (sessionUpdated) => {

  let slackMessage = {
    text: `*${sessionUpdated.Speaker}'s* session was just updated. :tada:`,
    attachments: [
      {
        fallback: `${sessionUpdated.Speaker} session was just updated.`,
        color: '#36a64f',
        author_name: sessionUpdated.Speaker,
        author_link: sessionUpdated.SpeakerUrl,
        title: sessionUpdated.Title,
        title_link: sessionUpdated.URL,
        text: sessionUpdated.ShortDescription,
        fields: [
              {
                  title: 'Room',
                  value: sessionUpdated.Room,
                  short: true
              },
              {
                  title: 'Time',
                  value: sessionUpdated.Time,
                  short: true
              }
          ]
      }
    ]
  }

  return slackMessage
}
