#!/bin/bash

MSG=$(
  cd /judges 2>&1 && git pull https://github.com/automaidan/judges.git 2>&1 && \
  cd scraper 2>&1 && npm run scrap 2>&1 && \
  git add . 2>&1 && git commit -m "Rescrap" 2>&1 && \
  npm run deploy:frontend 2>&1
)

if [ $? -ne 0 ]; then
    curl -d "m=$MSG" SNITCH_URL
fi
