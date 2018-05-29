const express = require('express');
const passport = require('passport');
const JsonStrategy = require('passport-json').Strategy;
const crypto = require('crypto');
const mongoose = require('mongoose');

const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

const obj = JSON.parse(fs.readFileSync('./server/data/posts.json', 'utf8'));
const user = JSON.parse(fs.readFileSync('./server/data/user.json', 'utf8')).user;
const users = JSON.parse(fs.readFileSync('./server/data/users.json', 'utf8'));


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

const compareHashtag = (a, b) => {
  for (let i = 0; i < a.length; i += 1) {
    if (b.indexOf(a[i]) === -1) return false;
  }
  return true;
};

const dateToString = (photoPost) => {
  const created = new Date(photoPost.createdAt);
  const date = created.getDate() > 10 ? created.getDate() : `0${created.getDate()}`;
  const month = (+created.getMonth() + 1) > 10 ? (+created.getMonth() + 1) : `0${(+created.getMonth() + 1)}`;
  const year = created.getFullYear();
  return `${year}-${month}-${date}`;
};

const getRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

const sha512 = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value,
  };
};

const saltHashPassword = (userpassword) => {
  const salt = getRandomString(16); /** Gives us salt of length 16 */
  return sha512(userpassword, salt);
};

const getUserPassword = (login) => {
  const currentUser = users.find(element => element.username === login);
  const password = currentUser.password;
  if (password !== undefined) {
    console.log(password);
    return password;
  }
  return false;
};

const verifyPassword = function (login, password) {
  const userPassword = getUserPassword(login);
  if (!userPassword) {
    return false;
  }
  const hashPassword = sha512(password, userPassword.salt);
  if (hashPassword.passwordHash !== userPassword.passwordHash) {
    return false;
  }
  return { username: login, password: password };
};

passport.use(new JsonStrategy(
  { passReqToCallback: true },

  (req, username, password, done) => {
    const currentUser = verifyPassword(username, password);

    if (!currentUser) return done(null, false);


    if (password !== currentUser.password) {
      return done(null, false);
    }

    return done(null, currentUser);
  }
));

passport.serializeUser((username, done) => {
  done(null, username);
});

passport.deserializeUser((username, done) => {
  console.log('asfasfd');
  done(null, username);
});

app.post('/login', passport.authenticate('json', { failureRedirect: '/loginfail' }), (req, res) => {
  res.sendStatus(200);
});

app.get('/loginfail', (req, res) => {
  res.json(200, false);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.json(200, true);
});

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

  filteredPhotoPosts = obj.filter(photoPost =>
    filterFields.every((filterField) => {
      if (filterField === 'hashtags') {
        if (compareHashtag(filter[filterField], photoPost[filterField])) return true;
        return false;
      }
      if (filterField === 'createdAt') {
        if (dateToString(photoPost) === filter[filterField]) return true;
        return false;
      }
      if (photoPost[filterField] === filter[filterField]) return true;
      return false;
    }));

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

async function connectDatabase() {
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost:27017/')
    .then(() => {
      console.log('Connected to database!!!');
    })
    .catch((err) => {
      throw new Error(err);
    });
}

const postSchema = new mongoose.Schema({
  id: String,
  description: String,
  createdAt: String,
  author: String,
  photoLink: String,
  hashtags: [String],
  likes: [String],
});

const usersSchema = new mongoose.Schema({
  username: String,
  password: {
    salt: String,
    passwordHash: String,
  },
});

const currentUserSchema = new mongoose.Schema({
  currentUser: String,
});

const Post = mongoose.model('Post', postSchema);
const Users = mongoose.model('User', usersSchema);
const CurrentUser = mongoose.model('CurrentUser', currentUserSchema);

function getMongoPost(id, callback) {
  Post.find({}, (err, post) => {
    if (err) throw err;
    console.log(post);
    fs.writeFileSync('./server/data/jsmongonon.json', JSON.stringify(post));
  });
}

app.get('/test', (req, res) => {
  // fs.writeFileSync('./server/data/jsmongonon.json', JSON.stringify(getMongoPosts()));
  getMongoPost('714');
});
connectDatabase();

app.listen(3000, (data) => {
  console.log(`Server now listening on port: 3000 ${data}`);
  /* users.forEach((element) => {
    const mongoUsers = new Users({
      username: element.username,
      password: { salt: element.password.salt, passwordHash: element.password.passwordHash },
    });

    return mongoUsers.save((err) => {
      if (err) {
        throw new Error(err);
      }
    });
  }); */
  /* obj.forEach((element) => {
    const mongoPost = new Post({
      id: element.id,
      description: element.description,
      createdAt: element.createdAt,
      author: element.author,
      photoLink: element.photoLink,
      hashtags: element.hashtags,
      likes: element.likes,
    });

    return mongoPost.save((err) => {
      if (err) {
        throw new Error(err);
      }
    });
  }); */
  /* const mongoCurrentUser = new CurrentUser({
    currentUser: user,
  });

  return mongoCurrentUser.save((err) => {
    if (err) {
      throw new Error(err);
    }
  }); */
});
