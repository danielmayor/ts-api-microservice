const express = require('express');
const bodyParser = require('body-parser');

const https = require('https')
const fs = require('fs')

const app = express();
const digestList = [];
const digestDict = {};

function updateFile(file, element) {
  fs.writeFile(file, JSON.stringify(element), function (err) {
    if (err) throw err;
  });
}

fs.writeFile('digestDict.txt', '', { flag: 'wx' }, function (err) {
    console.log('digestDict persistent storage ready');
});
fs.writeFile('digestList.txt', '', { flag: 'wx' }, function (err) {
    console.log('digestList persistent storage ready');
});

fs.readFile('digestList.txt', 'utf8', function (err, dl_content) {
  if (err) throw err;
  if (dl_content) {
    console.log(dl_content);
  }
});

fs.readFile('digestDict.txt', 'utf8', function (err, dd_content) {
  if (err) throw err;
  console.log('digestDict ready');
});

app.use(bodyParser.json());
app.set('json spaces', 2);

app.post('/messages', (req, res) => {
  // code to add a message and SHA256 hash digest...
  var crypto = require('crypto');
  const digest = crypto.createHash('sha256').update(req.body.message).digest('hex');

  if (digestDict.includes(digest)) {
    console.log('key already exists!');
  } else {
    console.log('key does not exist: ' + digest);
    digestList.push(digest);
    digestDict[digest] = req.body.message
    updateFile('digestList.txt', digestList);
    updateFile('digestDict.txt', digestDict);
  }

  //fs.writeFile('digestList.txt', JSON.stringify(digestList), function (err) {
  //  if (err) throw err;
  //  console.log('digestList updated');
  //});

  //fs.writeFile('digestDict.txt', JSON.stringify(digestDict), function (err) {
  //  if (err) throw err;
  //  console.log('digestDict updated: key ' + req.body.message + ' saved!');
  //});

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
    console.log(req.params[0] + ' hash does not exist!');
    res.sendStatus(404);
  }
});

https.createServer({
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem'),
	passphrase: 'talkspace'
}, app).listen(3000, () => console.log('Node.js server started'));

