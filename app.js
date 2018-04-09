let express = require('express'),
  app = express();
let fs = require('fs');
let bodyParser = require('body-parser');

var obj = JSON.parse(fs.readFileSync('./server/data/posts.json', 'utf8'));
var user = JSON.parse(fs.readFileSync('./server/data/user.json', 'utf8')).user;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/UI/index.html');
});

app.get('/posts', (req, res) => {
  res.send(JSON.stringify(obj));
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
  let post = obj.find(photoPost => photoPost.id === req.params.id);
  let skip = obj.indexOf(post);
  obj.splice(skip, 1, req.body);
  fs.writeFileSync('./server/data/posts.json', JSON.stringify(obj));
  res.json(req.body);
});

app.delete('/removePhotoPost/:id', (req, res) =>  {
  let post = obj.find(photoPost => photoPost.id === req.params.id);
  let skip = obj.indexOf(post);
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
  console.log(`Server now listening on port: 3000`);
});

