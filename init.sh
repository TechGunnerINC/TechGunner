#!/bin/bash

echo "Initializing Frontend... ✨"
cd frontend
bun update

echo "Initializing Backend... 💻"
cd ../backend
bun update

echo "Launching Docker... 🐳"
docker compose up -d
docker compose watch

exit 0