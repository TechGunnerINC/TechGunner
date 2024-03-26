#!/bin/bash

echo "Initializing Frontend... ✨"
cd frontend
bun i

echo "Initializing Backend... 💻"
cd ../backend
bun i

echo "Launching Docker... 🐳"
retry=5

command="docker compose watch"

attempt=1
while [[ $attempt -le $retry ]]; do
  if $command; then
    echo "Docker launched successfully!"
    echo "🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳"
    break
  else
    echo "Error while launching Docker, retrying attempt $attempt/$retry..."
    ((attempt++))
  fi
done

if [[ $attempt -gt $retry ]]; then
  echo "Docker failed to execute after $retry attempts."
  exit 1
fi
docker compose logs -f