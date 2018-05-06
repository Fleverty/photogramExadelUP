!function(photoPosts, schema) {
  'use strict'


  var SCHEMA = schema;
  let postService = {}

  postService.getPhotoPosts = (skip = 0, top = 10, filter) => {
    if (!filter){
      window.photoPosts.sort((a, b) => {
        return b.createdAt - a.createdAt
      })
      return window.photoPosts.slice(skip, top);
    } 
      
    const filterFields = Object.keys(filter).filter(filterField => {
      return (window.SCHEMA.FIELDS_VALID_TO_FILTER.indexOf(filterField) !== -1 && filter[filterField] !== "")
    });

    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/filter?skip=' + skip + '&top=' + top + '&filterFields=' + filterFields.join(','), false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if(xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
        }
        else {
          resolve(JSON.parse(xhr.responseText, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
          }))
        }
      }
      xhr.send(JSON.stringify(filter));
    })

    
  }
    
    
  postService.getPhotoPost = id =>{
    return new Promise((resolve, reject) => {
      if(!id) {
        return;
      }

      let xhr = new XMLHttpRequest();
      xhr.open('GET', '/posts/' + id + ' ', false)
      
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
        console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
        }
        else {
          resolve(JSON.parse(xhr.responseText, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
          }));
        }
      }
      xhr.send();
    })
    
  } 
    

  postService.validatePhotoPost = photoPost => {
    const fieldsToValidate = Object.keys(window.SCHEMA.PHOTOPOST);
    const photoPostFields = Object.keys(photoPost);
    
    return fieldsToValidate.every(fieldToValidate => {
      return photoPostFields.indexOf(window.SCHEMA.PHOTOPOST[fieldToValidate].NAME) !== -1 && 
        (typeof photoPost[window.SCHEMA.PHOTOPOST[fieldToValidate].NAME]) === window.SCHEMA.PHOTOPOST[fieldToValidate].TYPE;
    });
  }
    
    
  postService.addPhotoPost = photoPost => {
    return new Promise((resolve, reject) => {
      if(!postService.validatePhotoPost(photoPost)) {
        reject(false);
      }

      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/addPhotoPost', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if(xhr.readyState !== 4) {
          return;
        }

        if(xhr.status !== 200) {
          console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
          reject(false);
        }

        else {
          resolve(true);
        }
        
      }
      xhr.send(JSON.stringify(photoPost));
    })
  }
    
  postService.editPhotoPost = async (id, editPost) => {
    let postToUpdate = await postService.getPhotoPost(id);
    if (!postToUpdate) {
      return false;
    } 
    
    const fieldsToUpdate = Object.keys(editPost);

    const validFields = fieldsToUpdate.filter(fieldToUpdate => {
      return window.SCHEMA.FIELDS_VALID_TO_UPDATE.indexOf(fieldToUpdate) !== -1;
    })

    if(validFields.length === 0) {
      return false;
    }
    
    validFields.forEach(fieldToUpdate => {
      postToUpdate[fieldToUpdate] = editPost[fieldToUpdate];
    });
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('PUT', '/editPhotoPost/' + id + ' ', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if(xhr.readyState !== 4) {
          return;
        }

        if(xhr.status !== 200) {
          console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
          reject(false);
        }

        else {
          console.log(postService.validatePhotoPost(postToUpdate));
          resolve(postService.validatePhotoPost(postToUpdate));
        }
        
      }
      xhr.send(JSON.stringify(postToUpdate));
    })
  }
    
    
  postService.removePhotoPost = id => {
    return new Promise((resolve, reject) => {
      const photoPost = postService.getPhotoPost(id);
      if (!photoPost) {
        return false;
      } 
      let xhr = new XMLHttpRequest();
      xhr.open('DELETE', '/removePhotoPost/' + id + ' ', false);
      xhr.onreadystatechange = function() {
        if(xhr.readyState !== 4) {
          return;
        }

        if(xhr.status !== 200) {
          console.log(xhr.status + ': ' + xhr.responseText || xhr.statusText);
          reject(false);
        }

        else {
          resolve(true);

        }
        
      }
      xhr.send(id);
    })
  }
    
  postService.compareHashtag = (a, b) => {
    for(var i = 0; i < a.length; i++) {
      if(b.indexOf(a[i]) === -1) return false;
    }
    return true;
  }

  postService.liking = async (id, user) => {
    let arrLikes = await postService.getPhotoPost(id);
    console.log(arrLikes);
    console.log(arrLikes.likes);
    let oldUSer = arrLikes.likes.find(element => {
      return element === user;
    });
    console.log(oldUSer);
    if(oldUSer === undefined) {
      arrLikes.likes.push(user);
    }
    else {
      arrLikes.likes.pop(user);
    }
    console.log(arrLikes.likes);
    return arrLikes.likes;
  }
 
  postService.dateToString = (photoPost) => {
    return photoPost.createdAt.getDate() + "-" + (+photoPost.createdAt.getMonth() + 1) + "-" + photoPost.createdAt.getFullYear();
  }

  postService.easy = async() => {
    let arrLikes = await postService.getPhotoPost("5");
    console.log(arrLikes.likes);
  }

  window.postService = postService;

}(window.photoPosts, window.SCHEMA)