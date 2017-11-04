const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const https = require('https');
const commandLineArgs = require('command-line-args');
const ejs = require('ejs');

const options = commandLineArgs([
  { name: 'estimation', alias: 'e', type: String },
  { name: 'message', alias: 'm', type: String }
]);

function createServer(app) {
  if (process.env.NODE_ENV == 'production') {
    const httpsConfig = {
      ca: fs.readFileSync(path.join(os.homedir(), 'certs', 'bs-multi-2.ca-bundle')).toString(),
      key: fs.readFileSync(path.join(os.homedir(), 'certs', 'private-key.pem')).toString(),
      cert: fs.readFileSync(path.join(os.homedir(), 'certs', 'bs-multi-2.crt')).toString()
    };

    return https.createServer(httpsConfig, app);
  } else {
    return http.createServer(app);
  }
}

const app = express();
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts')));
app.use('/css', express.static(path.join(__dirname, 'public', 'stylesheets')));
app.use('/img', express.static(path.join(__dirname, 'public', 'images')));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

const server = createServer(app);

const startDate = new Date();

app.get('*', (req, res) => {
  res.status(503);

  if (req.is('application/json')) {
    res.json({
      error: 'Currently down for maintenance.'
    });
  } else {
    res.render('index', {
      startDate,
      estimation: options['estimation'],
      message: options['message']
    });
  }
})

server.listen(8080);