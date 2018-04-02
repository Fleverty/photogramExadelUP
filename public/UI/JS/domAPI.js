!function(postsService, pageListener) {
  'use strict'

  let domService ={};

    
  domService.user = "Lentach";
  var newUser = JSON.parse(localStorage.getItem('user'));
  domService.user = newUser;

  domService.saveUser = () => {
    let localUser = JSON.stringify(domService.user);
    localStorage.setItem('user', localUser);
  }
    
  domService.detailPhotoPostView = (photoPost) => {
    let hashtags = "";
    for(var i = 0; i < photoPost.hashtags.length; i++ ) {
        hashtags += '#' + photoPost.hashtags[i] + " " ;
    }

    let view = "<div class = \"headerpost\">" +
          "<div class = \"author\">" + photoPost.author + "</div>" + 
          "<div class = \"time\">" + photoPost.createdAt + "</div>" +  
        "</div>" +
        "<div class = \"photo\"><img src =" + photoPost.photoLink + "> </div>" +
        "<div class = \"likemenu\">" +
          "<div class = \"like\">" +
            "<div class = \"like_icon\" onclick = 'window.pageListener.putLike(event)'><img src = \"http://jetgram.ru/wp-content/uploads/2015/07/heart-icon-e1437983700774.png\"></div>" +
            "<div class = \"count\">" + photoPost.likes.length + "</div>" + 
        "</div>" + 
          "<div class = \"editdel\">"+
              "<div class = \"edit\"  onclick = 'window.pageListener.detailEditForm(event)'><button>Edit</button></div>" + 
              "<div class = 'delete' onclick = 'window.pageListener.deletePost(event)'><button>Delete</button></div>" +
          "</div>" + 
        "</div>" + 
        "<div class = \"hashtags\">" + 
          hashtags +
        "</div>" +
        "<div class = \"description\">" +
          "<div class = \"username\">" + photoPost.author + "</div>" +
          "<div class = \"about\">" + photoPost.description + "</div>" +
        "</div>";

    return view;
  } 
    
  domService.showPosts = (skip = 0, top = 10, filter) => {
    postService.getPhotoPosts(skip, top, filter).forEach(function(elem) {
      let detailPhotoPost = document.createElement('div');
      detailPhotoPost.id = elem.id;
      detailPhotoPost.className = "post"
      detailPhotoPost.innerHTML =  domService.detailPhotoPostView(elem);
      let content = document.querySelector("div.content");
      let buttonMore = document.querySelector("div.btnmore");
      content.insertBefore(detailPhotoPost, buttonMore);
    });

    var arr = [];
    window.photoPosts.forEach(function(element){
      if(!arr.includes(element.author)) arr.push(element.author);
    });

    let place = document.querySelector('select.author-select');
    arr.forEach(function(element) {
      place.innerHTML += '<option>' + element + '</option>' 
    });
  }

  domService.clean = () => {
    document.querySelectorAll("div.post").forEach(function(elem) {
    let content = document.querySelector("div.content");
    content.removeChild(elem);
    });
  }
    
  domService.addPost = (photoPost) => {
    if(!postService.addPhotoPost(photoPost)) {
      return false;
    }

    let postViem = document.createElement('div');
    postViem.className = "post";
    postViem.id = photoPost.id;
    postViem.innerHTML = domService.detailPhotoPostView(photoPost);
    let content = document.querySelector("div.content");
    let place = document.querySelector("div.content").children[0];
    content.insertBefore(postViem, place);
  }
    
  domService.deletePost = id => {
    if(!postService.removePhotoPost(id)) {
      return false;
    }  

    let post = document.getElementById(id);
    let content = document.querySelector("div.content");
    content.removeChild(post);
  }
    
  domService.editPost = (id, editField) => {
    if(!postService.editPhotoPost(id, editField)) {
      return false;
    }
    let post = document.getElementById(id);
    let editPost = postService.getPhotoPost(id);
    let editElement = domService.getDomElement(domService.detailPhotoPostView(editPost), editPost);
    let currentPost = document.getElementById(id);
    let content = document.querySelector("div.content");
    content.insertBefore(editElement, currentPost);
    content.removeChild(currentPost) 
  }
    
  domService.getDomElement = (postView, post) => {
    let element = document.createElement('div');
    element.className = 'post';
    element.id = post.id;
    element.innerHTML = postView;
    return element;
  }
    
  domService.userConfig = value => {
    let login = document.querySelector('div.login');
    let place = document.querySelector('div.search');
    let posts = document.querySelectorAll('div.likemenu');
    login.innerHTML = "Sign in"

    posts.forEach(function(elem) {
      let editdel = document.querySelector('div.editdel');
      if(elem.contains(editdel)) elem.removeChild(editdel);
    })

    let add = document.querySelector('div.btn');
    if(place.contains(add)) {
      place.removeChild(add);
    }

    if (value !== null) {
      let login = document.querySelector('div.login');
      let place = document.querySelector('div.search');
      let author = document.querySelectorAll('div.author');
      let likemenu = document.querySelectorAll('div.likemenu');
      login.innerHTML = value;
      for(var i = 0; i < likemenu.length; i++) {
        if(author[i].innerHTML === value){
          let newEditDel = document.createElement('div');
          newEditDel.className = 'editdel';
          newEditDel.innerHTML = "<div class = \"edit\" onclick = 'window.pageListener.detailEditForm(event)'><button>Edit</button></div>" +
            "<div class = 'delete' onclick = 'window.pageListener.deletePost(event)'><button>Delete</button></div>";
          likemenu[i].appendChild(newEditDel);
        }
      }
      let searchBar = document.querySelector('div.searchbar')
      let newAdd = document.createElement('div');
      newAdd.className = 'btn';
      newAdd.innerHTML = "<button onclick='window.pageListener.detailAddForm()' >+ Add new post</button>";
      place.insertBefore(newAdd, searchBar); 
    }

    domService.like = (id, user) => {
      postService.liking(id, user);
      domService.editPost(id, {likes: postService.getPhotoPost(id).likes});
      domService.userConfig(domService.user);
    }

    domService.saveUser();
    
  }
    
  window.domService = domService;

}(window.postsService, window.pageListener)