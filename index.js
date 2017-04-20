require('dotenv').config()

const Request = require('request')
const Winston = require('winston')

const SLACK_URL = process.env.SLACK_URL
//console.log(`SLACK_URL: ${SLACK_URL}`)

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
  console.log(`titoMessage Called`)

  return Promise.resolve()
   .then(() => {
     if (req.method !== 'POST') {
       const error = new Error('Only POST requests are accepted');
       error.code = 405;
       throw error;
     }

      const message = req.body
      const slackMessage = buildSlackMessage(message)
      //console.log(`slack message ${JSON.stringify(slackMessage)}`)

      postPayload.text = slackMessage.text
      postPayload.attachments = slackMessage.attachments

      //console.log(`Slack Payload: ${JSON.stringify(postPayload)}`)
      options.body = JSON.stringify(postPayload)

      //console.log(`Sending Message To Slack`)
      Request(options, (error, response, body) => {
        console.log(`Slack Response Code: ${response.statusCode}`)

       if (!error && response.statusCode == 200) {
          console.log(`Message Sent To Slack`)
           Winston.info(body)
           res.status(response.statusCode)
           res.send('slack message sent');
         }
         res.end();
      })

    })
    .catch((err) => {
      console.error(err);
      const code = err.code || (err.response ? err.response.statusCode : 500) || 500;
      res.status(code).send(err);
      return Promise.reject(err);
    });
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
