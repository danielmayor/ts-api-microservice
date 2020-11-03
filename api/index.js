const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const digestList = [];
const digestDict = {};

app.use(bodyParser.json());

app.post('/messages', (req, res) => {
  // code to add a message and SHA256 hash digest...
  var crypto = require('crypto');
  const digest = crypto.createHash('sha256').update(req.body.message).digest('hex');
  digestList.push(digest);
  digestDict[digest] = req.body.message
  res.json({"digest":digest});
  res.end();
});

app.get('/messages', (req, res) => {
  // code to retrieve the list of message hashes...
  res.send({"digestList":digestList});
  res.end();
});

app.get('/messages/*', (req, res) => {
  // code to retrieve a SHA256 hash digest...
  const hash_digest = req.params[0];
  if (digestList.includes(hash_digest)) {
    res.send(digestDict[hash_digest]);
    res.end();
  } else {
    res.sendStatus(404);
  }
});

app.listen(3000, () => console.log('server started'));

