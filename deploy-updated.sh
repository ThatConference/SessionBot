#!/bin/bash
gcloud beta functions deploy SessionUpdated --trigger-http --stage-bucket cloudfunctions-sessionupdated --source . --entry-point sessionUpdated --memory 128 --runtime nodejs10
