let express = require('express'),
  app = express();
let fs = require('fs');
let bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/photoPosts', (req, res) => {
  let mapper = new articleMapper.ArticleMapper();
  mapper.setArticlesToDb(req.body);
  res.json(req.body);
});
  
  //<-- get methods -->
app.get('/photoPosts', (req, res) => {
  res.send(JSON.stringify(new dataMapper.DataMapper().loadArticles()));
});
  
app.get('/photoPosts', (req, res) => {
  res.send(JSON.stringify(new userMapper.UserMapper().getCurrentUserFromDb()));
});
  
app.get('/domApi', (req, res) => {
  res.json(new userMapper.UserMapper().getUsersFromDb());
});
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/UI/index.html');
});
app.get('./server', function(req, res) {
  res.sendfile(_dirname + '/data/posts.json')
})
   
app.delete('/logout', (req, res) => {
  new userMapper.UserMapper().deleteCurrentUserFromDb();
  res.json({userWasRemoved: 'ok'});
});

app.listen(3000, (data) => {
  console.log(`Server now listening on port: 3000`);
});
