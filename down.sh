#!/bin/sh

forever stop ~/bs-frontend-us/lib/Server.js
NODE_ENV=production forever start ./main.js

