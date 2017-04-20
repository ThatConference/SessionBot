# That Session Bot

Simple. Receive incoming data from session changes on ThatConference.com and push them to ThatSlack.Slack.com in #Session_Updates.

### env variables

To run a .env file will need to have the right configuration in which to talk with slack.

```
SLACK_URL=https://hooks.slack.com/services/[theGoodStuff]
```

### Deployment

Deploys to Google Cloud Functions, resides in a storage-bucket

```
 gcloud beta functions deploy [FUNCTION] --trigger-http --stage-bucket [BUCKET] --source-path / --entry-point [ENTRYPOINT] --memory 128
```
