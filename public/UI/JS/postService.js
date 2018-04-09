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
    if(filter["hashtags"][0] === "") {
      filterFields.splice(filterFields.indexOf("hashtags"), 1);
    }
    

    var filteredPhotoPosts = [];

    if(filterFields.indexOf("hashtags") === -1){
      filteredPhotoPosts = window.photoPosts.filter(photoPost => {
      return filterFields.every(filterField => photoPost[filterField] === filter[filterField]);
      });
    }

    if(filterFields.indexOf("hashtags") !== -1){
      var filteredByHashtag = window.photoPosts.filter(photoPost => {
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

    return filteredPhotoPosts.slice(skip, top);
  }
    
    
  postService.getPhotoPost = id =>{
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/posts/' + id + ' ', false);
    xhr.send(id);

    if (!xhr.responseText) return undefined;
    return JSON.parse(xhr.responseText);
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
    if(postService.validatePhotoPost(photoPost)) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/addPhotoPost', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(photoPost));
      return true;
    }
    return false;
  }
    
  postService.editPhotoPost = (id, editPost) => {
    let postToUpdate = postService.getPhotoPost(id);
    let skip = photoPosts.indexOf(postService.getPhotoPost(id));
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

    let xhr = new XMLHttpRequest();
    xhr.open('PUT', '/editPhotoPost/' + id + ' ', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(postToUpdate));

    return postService.validatePhotoPost(postToUpdate);
  }
    
    
  postService.removePhotoPost = id => {
    const photoPost = postService.getPhotoPost(id);
    if (!photoPost) {
      return false;
    } 
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/removePhotoPost/' + id + ' ', false);
    xhr.send(id);
    return true;
  }
    
  postService.compareHashtag = (a, b) => {
    for(var i = 0; i < a.length; i++) {
      if(b.indexOf(a[i]) === -1) return false;
    }
    return true;
  }

  postService.liking = (id, user) => {
    var arrLikes = postService.getPhotoPost(id).likes;
    let oldUSer = arrLikes.find(element => {
      return element === user;
    });
    if(oldUSer === undefined) {
      arrLikes.push(user);
    }
    else {
      arrLikes.pop(user);
    }
    return arrLikes;
  }

  window.postService = postService;

}(window.photoPosts, window.SCHEMA)