#!/bin/bash
gcloud beta functions deploy SessionCancelled --trigger-http --stage-bucket cloudfunctions-sessioncancelled --source . --entry-point sessionCancelled --memory 128 --runtime nodejs10
