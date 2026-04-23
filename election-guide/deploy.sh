#!/bin/bash
# ─── VoteGenie — Google Cloud Run Deploy Script ───────────────────────────
set -e

PROJECT_ID="votegenie"
SERVICE_NAME="votegenie"
REGION="us-central1"

echo ""
echo "🗳️  VoteGenie — Deploying to Google Cloud Run"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Project : $PROJECT_ID"
echo "   Service : $SERVICE_NAME"
echo "   Region  : $REGION"
echo ""

# Check gcloud is installed
if ! command -v gcloud &> /dev/null; then
  echo "❌  gcloud CLI not found."
  echo "    Install it: brew install google-cloud-sdk"
  echo "    Then run:   gcloud auth login"
  exit 1
fi

# Set project
echo "📌  Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable APIs
echo "⚙️   Enabling required APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com --quiet

# Deploy
echo ""
echo "🚀  Deploying... (this takes ~2 minutes)"
echo ""
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --quiet

echo ""
echo "✅  Deployed! Your app is live at:"
gcloud run services describe $SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --format "value(status.url)"
echo ""
