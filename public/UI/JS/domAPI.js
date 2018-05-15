
(function (postService, photoPosts) {
  const domService = {};

  domService.user = '';

  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/currentUser', false);
  xhr.send();
  domService.user = xhr.responseText;

  domService.saveUser = () => {
    xhr = new XMLHttpRequest();
    xhr.open('POST', '/updateUser', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ user: domService.user }));
  };

  domService.detailPhotoPostView = (photoPost) => {
    let hashtags = '';
    for (let i = 0; i < photoPost.hashtags.length; i += 1) {
      hashtags += `#${photoPost.hashtags[i]}`;
    }

    const view =
      '<div class = "headerpost">' +
      `<div class = "author">${photoPost.author}</div>` +
      `<div class = "time">${postService.dateToString(photoPost)}</div>` +
      '</div>' +
      `<div class = "photo"><img src =${photoPost.photoLink}> </div>` +
      '<div class = "likemenu">' +
      '<div class = "like">' +
      '<div class = "like_icon" onclick = \'window.pageListener.putLike(event)\'><img src = "http://jetgram.ru/wp-content/uploads/2015/07/heart-icon-e1437983700774.png"></div>' +
      `<div class = "count">${photoPost.likes.length}</div>` +
      '</div>' +
      '<div class = "editdel">' +
      '<div class = "edit"  onclick = \'window.pageListener.detailEditForm(event)\'><button>Edit</button></div>' +
      '<div class = "delete" onclick = "window.pageListener.deletePost(event)"><button>Delete</button></div>' +
      '</div>' +
      '</div>' +
      `<div class = "hashtags">${hashtags}</div>` +
      '<div class = "description">' +
      `<div class = "username">${photoPost.author}</div>` +
      `<div class = "about">${photoPost.description}</div>` +
      '</div>';

    return view;
  };

  domService.buttonMore = () => {
    const view = '<div class = "btnmore" onclick = "window.pageListener.pagination()">' +
    '<button>Show more</button>' +
    '</div>';
    return view;
  };

  domService.showPosts = async (skip = 0, top = 10, filter) => {
    const array = await postService.getPhotoPosts(skip, top, filter);
    const content = document.querySelector('div.content');
    const buttonMore = document.querySelector('div.btnmore');
    if (buttonMore) content.removeChild(buttonMore);
    array.forEach((elem) => {
      const detailPhotoPost = document.createElement('div');
      detailPhotoPost.id = elem.id;
      detailPhotoPost.className = 'post';
      detailPhotoPost.innerHTML = domService.detailPhotoPostView(elem);
      content.insertBefore(detailPhotoPost, buttonMore);
    });

    const arr = [];
    window.photoPosts.forEach((element) => {
      if (!arr.includes(element.author)) arr.push(element.author);
    });


    const place = document.querySelector('select.author-select');
    place.innerHTML = '';
    arr.forEach((element) => {
      place.innerHTML += `<option>${element}</option>`;
    });

    if (photoPosts.length > 10) {
      content.innerHTML += domService.buttonMore();
    }
    domService.userConfig(domService.user);
  };

  domService.clean = () => {
    document.querySelectorAll('div.post').forEach((elem) => {
      const content = document.querySelector('div.content');
      content.removeChild(elem);
    });

  };

  domService.addPost = async (photoPost) => {
    if ((await postService.addPhotoPost(photoPost)) === false) {

      return false;
    }

    const postViem = document.createElement('div');
    postViem.className = 'post';
    postViem.id = photoPost.id;
    postViem.innerHTML = domService.detailPhotoPostView(photoPost);
    const content = document.querySelector('div.content');
    const place = document.querySelector('div.content').children[0];
    content.insertBefore(postViem, place);
    return true;
  };

  domService.deletePost = async (id) => {
    if ((await postService.removePhotoPost(id)) === false) 
      return false;
    }

    const post = document.getElementById(id);
    const content = document.querySelector('div.content');
    content.removeChild(post);
    return true;
  };

  domService.editPost = async (id, editField) => {
    if ((await postService.editPhotoPost(id, editField)) === false) {
      return false;
    }
    const editPost = await postService.getPhotoPost(id);
    const editElement = domService.getDomElement(
      domService.detailPhotoPostView(editPost),
      editPost
    );
    const currentPost = document.getElementById(id);
    const content = document.querySelector('div.content');
    content.insertBefore(editElement, currentPost);
    content.removeChild(currentPost);
    domService.userConfig(domService.user);
    return true;
  };

  domService.getDomElement = (postView, post) => {
    const element = document.createElement('div');
    element.className = 'post';
    element.id = post.id;
    element.innerHTML = postView;
    return element;
  };

  domService.userConfig = (value) => {
    const login = document.querySelector('div.login');
    const place = document.querySelector('div.search');
    const posts = document.querySelectorAll('div.likemenu');
    login.innerHTML = 'Sign in';

    posts.forEach((elem) => {
      const editdel = document.querySelector('div.editdel');
      if (elem.contains(editdel)) elem.removeChild(editdel);
    });

    const add = document.querySelector('div.btn');
    if (place.contains(add)) {
      place.removeChild(add);
    }

    if (value !== null) {
      const author = document.querySelectorAll('div.author');
      const likemenu = document.querySelectorAll('div.likemenu');
      login.innerHTML = value;
      for (let i = 0; i < likemenu.length; i += 1) {
        if (author[i].innerHTML === value) {
          const newEditDel = document.createElement('div');
          newEditDel.className = 'editdel';
          newEditDel.innerHTML =
            '<div class = "edit" onclick = \'window.pageListener.detailEditForm(event)\'><button>Edit</button></div>' +
            '<div class = "delete" onclick = "window.pageListener.deletePost(event)"><button>Delete</button></div>';
          likemenu[i].appendChild(newEditDel);
        }
      }
      const searchBar = document.querySelector('div.searchbar');
      const newAdd = document.createElement('div');
      newAdd.className = 'btn';
      newAdd.innerHTML =
        '<button onclick="window.pageListener.detailAddForm()" >+ Add new post</button>';
      place.insertBefore(newAdd, searchBar);
    }

    domService.like = async (id, user) => {
      const likes = await postService.liking(id, user);
      console.log(likes);
      domService.editPost(id, { likes: likes });
      domService.userConfig(domService.user);
    };

    domService.saveUser();
  };

  window.domService = domService;
}(window.postService, window.photoPosts));
