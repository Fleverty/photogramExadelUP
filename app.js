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

app.post('/filter', (req, res) => {
  let skip = JSON.parse(req.query.skip);
  let top = JSON.parse(req.query.top);
  let filterFields = req.query.filterFields.split(',');
  let filter = req.body;

  var filteredPhotoPosts = [];

    if(filterFields.indexOf("hashtags") === -1){
      filteredPhotoPosts = obj.filter(photoPost => {
      return filterFields.every(filterField => photoPost[filterField] === filter[filterField]);
      });
    }

    if(filterFields.indexOf("hashtags") !== -1){
      var filteredByHashtag = obj.filter(photoPost => {
      return  postService.compareHashtag(filter.hashtags, photoPost.hashtags);
      })
      filterFields.splice(filterFields.indexOf("hashtags"), 1);
      filteredPhotoPosts = filteredByHashtag.filter(photoPost => {
        return filterFields.every(filterField => photoPost[filterField] === filter[filterField]);
      });
    }

    if(filteredPhotoPosts.length > 1) filteredPhotoPosts.sort((a, b) => {
      return b.createdAt - a.createdAt
    });
    
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

