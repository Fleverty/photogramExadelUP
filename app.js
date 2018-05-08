const express = require('express');

const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

const obj = JSON.parse(fs.readFileSync('./server/data/posts.json', 'utf8'));
const user = JSON.parse(fs.readFileSync('./server/data/user.json', 'utf8')).user;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/UI/index.html`);
});

app.get('/posts', (req, res) => {
  res.send(JSON.stringify(obj));
});

app.post('/filter', (req, res) => {
  const skip = JSON.parse(req.query.skip);
  const top = JSON.parse(req.query.top);
  const filterFields = req.query.filterFields.split(',');
  const filter = req.body;

  let filteredPhotoPosts = [];

  if (filter.hashtags[0] === '') {
    filterFields.splice(filterFields.indexOf('hashtags'), 1);
  }

  if (filterFields.indexOf('hashtags') === -1) {
    filteredPhotoPosts = obj.filter(photoPost =>
      filterFields.every(filterField => photoPost[filterField] === filter[filterField]));
  }

  if (filterFields.indexOf('hashtags') !== -1) {
    const filteredByHashtag = obj.filter((photoPost) => {
      for (let i = 0; i < filter.hashtags.length; i += 1) {
        if (photoPost.hashtags.indexOf(filter.hashtags[i]) === -1) return false;
      }
      return true;
    });
    filterFields.splice(filterFields.indexOf('hashtags'), 1);
    filteredPhotoPosts = filteredByHashtag.filter(photoPost =>
      filterFields.every(filterField => photoPost[filterField] === filter[filterField]));
  }

  if (filteredPhotoPosts.length > 1) {
    filteredPhotoPosts.sort((a, b) => b.createdAt - a.createdAt);
  }

  res.send(JSON.stringify(filteredPhotoPosts.slice(skip, top)));
});

app.get('/posts/:id', (req, res) => {
  res.send(JSON.stringify(obj.find(photoPost => photoPost.id === req.params.id)));
});

app.post('/posts', (req, res) => {
  fs.writeFileSync('./server/data/posts.json', JSON.stringify(req.body));
  res.json(req.body);
});

app.post('/addPhotoPost', (req, res) => {
  obj.unshift(req.body);
  fs.writeFileSync('./server/data/posts.json', JSON.stringify(obj));
  res.json(req.body);
});

app.put('/editPhotoPost/:id', (req, res) => {
  const post = obj.find(photoPost => photoPost.id === req.params.id);
  const skip = obj.indexOf(post);
  obj.splice(skip, 1, req.body);
  fs.writeFileSync('./server/data/posts.json', JSON.stringify(obj));
  res.json(req.body);
});

app.delete('/removePhotoPost/:id', (req, res) => {
  const post = obj.find(photoPost => photoPost.id === req.params.id);
  const skip = obj.indexOf(post);
  obj.splice(skip, 1);
  fs.writeFileSync('./server/data/posts.json', JSON.stringify(obj));
  res.json(req.body);
});

app.get('/currentUser', (req, res) => {
  res.send(user);
});

app.post('/updateUser', (req, res) => {
  fs.writeFileSync('./server/data/user.json', JSON.stringify(req.body));
  res.json(req.body);
});

app.listen(3000, (data) => {
  console.log(`Server now listening on port: 3000 ${data}`);
});

