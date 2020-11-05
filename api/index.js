const express = require('express');
const bodyParser = require('body-parser');

const https = require('https')
const fs = require('fs')

const app = express();
const digestList = [];
const digestDict = {};

app.use(bodyParser.json());
app.set('json spaces', 2);

app.post('/messages', (req, res) => {
  // code to add a message and SHA256 hash digest...
  var crypto = require('crypto');
  const digest = crypto.createHash('sha256').update(req.body.message).digest('hex');
  digestList.push(digest);
  digestDict[digest] = req.body.message
  res.setHeader('Content-Type', 'application/json');
  res.status(201).send({'digest': digest});
});

app.get('/messages', (req, res) => {
  // code to retrieve the list of message hashes...
  res.setHeader('Content-Type', 'application/json');
  res.send({"digestList":digestList});
  res.end();
});

app.get('/all-messages', (req, res) => {
  // code to retrieve the list of message hashes...
  res.setHeader('Content-Type', 'application/json');
  res.send({"digestList":digestList});
  res.end();
});

app.get('/messages/*', (req, res) => {
  // code to retrieve a SHA256 hash digest...
  const hash_digest = req.params[0];
  if (digestList.includes(hash_digest)) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({'message': digestDict[hash_digest]});
  } else {
    res.sendStatus(404);
  }
});

https.createServer({
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem'),
	passphrase: 'talkspace'
}, app).listen(3000, () => console.log('Node.js server started'));

