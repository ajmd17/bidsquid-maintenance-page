#!/bin/sh

forever stop ./main.js
NODE_ENV=production forever start ~/bs-frontend-us/lib/Server.js

