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
  isPost(req, res)

  const message = req.body
  const slackMessage = buildSessionUpdatedSlackMessage(message)
  const reqOpts = buildPayload(slackMessage)

  Request(reqOpts).pipe(res)
}

exports.sessionCancelled = (req, res) => {
  isPost(req, res)

  const message = req.body
  const slackMessage = buildSessionCancelledSlackMessage(message)
  const reqOpts = buildPayload(slackMessage)

  Request(reqOpts).pipe(res)
}

const isPost = (req, res) => {
  if (req.method !== 'POST') {
    const error = new Error('Only POST requests are accepted')

    console.log(`Non Post Method Recieved: ${req.method}`)

    return res.status(405).send(error)
  }
}

const buildPayload = (slackMessage) => {
  const payload = Object.assign({}, slackMessage, postPayload)
  const reqOpts = Object.assign({ body: JSON.stringify(payload) }, options)

  console.log(`Formatted Slack Message: \n ${JSON.stringify(payload)}`)

  return reqOpts
}

const buildSessionUpdatedSlackMessage = (sessionUpdated) => ({
  text: `*${sessionUpdated.Speaker}'s* session was just updated. :bacon: :tada:`,
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
          title: sessionUpdated.Room.Changed ?  'Room Changed' : 'Room',
          value: sessionUpdated.Room.Changed ?  `${sessionUpdated.Room.Old} -> ${sessionUpdated.Room.Current}` : sessionUpdated.Room.Current,
          short: true
        },
        {
          title: sessionUpdated.Time.Changed ? 'Time Changed' : 'Time',
          value: sessionUpdated.Time.Changed ?  `${sessionUpdated.Time.Old} -> ${sessionUpdated.Time.Current}` : sessionUpdated.Time.Current,
          short: true
        }
      ]
    }
  ]
})

const buildSessionCancelledSlackMessage = (sessionUpdated) => ({
  text: `*${sessionUpdated.Title}* was just *cancelled*. :cry:`,
  attachments: [
    {
      fallback: `${sessionUpdated.Title} was just cancelled.`,
      color: '#36a64f',
      author_name: sessionUpdated.Speaker,
      author_link: sessionUpdated.SpeakerUrl,
      title: sessionUpdated.Title,
      title_link: sessionUpdated.URL,
      text: sessionUpdated.ShortDescription,
    }
  ]
})
