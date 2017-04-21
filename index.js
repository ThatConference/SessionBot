require('dotenv').config()
const Request = require('request')

const SLACK_URL = process.env.SLACK_URL
console.log(`SLACK_URL: ${SLACK_URL}`)

const headers = {
    'Content-Type': 'application/json'
}

const options = {
    url: SLACK_URL,
    method: 'POST',
    headers: headers,
    timeout: 5000
}

const postPayload = {
  channel: '#session_updates',
  username: 'ThatBot',
  icon_emoji: ':that:'
}

exports.sessionUpdated = (req, res) => {
  console.log(`Session Updated Message Called`)

  if (req.method !== 'POST') {
    const error = new Error('Only POST requests are accepted')

    console.log(`Non Post Method Recieved: ${req.method}`)

    return res.status(405).send(error)
  }

  const message = req.body
  const slackMessage = buildSlackMessage(message)
  const payload = Object.assign({}, slackMessage, postPayload)
  const reqOpts = Object.assign({ body: JSON.stringify(payload) }, options)

  console.log(`Formatted Slack Message: \n ${JSON.stringify(payload)}`)

  Request(reqOpts).pipe(res)
}

exports.sessionCancelled = (req, res) => {
}

const buildSlackMessage = (sessionUpdated) => ({
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
})
