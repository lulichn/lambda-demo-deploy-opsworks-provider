#!/bin/sh

npm install

zip -r deploy-function.zip index.js src node_modules
