#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting build for roymond/needledrop..."

# Build the image
docker build -t roymond/needledrop:latest .

echo "✅ Build successful! Pushing to Docker Hub..."

# Push the image
docker push roymond/needledrop:latest

echo "🎉 Done! Image is live."