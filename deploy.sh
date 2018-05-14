#!/bin/bash
npm install
node node_modules/gulp/bin/gulp build
npm run deploy
