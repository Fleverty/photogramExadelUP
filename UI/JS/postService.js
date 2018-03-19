!function(photoPosts, schema) {
    'use strict'

    photoPosts = photoPosts || [];

    var SCHEMA = schema;
    let postService = {}

    postService.getPhotoPosts = (skip = 0, top = 10, filter) => {
        if (!filter){
          window.photoPosts.sort((a, b) => {return a.createdAt - b.createdAt})
          return window.photoPosts.slice(skip, top);
        } 
      
          const filterFields = Object.keys(filter).filter(filterField => {
              return window.SCHEMA.FIELDS_VALID_TO_FILTER.indexOf(filterField) !== -1
          });
    
          if(filterFields.indexOf("hashtags") !== -1){
            var filteredByHashtag = window.photoPosts.filter(photoPost => {
              return  postService.compareHashtag(filter.hashtags, photoPost.hashtags);
            } )
            filterFields.splice(filterFields.indexOf("hashtags"), 1);
            var filteredPhotoPosts = filteredByHashtag.filter(photoPost => {
              return filterFields.every(filterField => photoPost[filterField] === filter[filterField]);
            });
          }
    
          
          if(filterFields.indexOf("hashtags") === -1){
            const filteredPhotoPosts = window.photoPosts.filter(photoPost => {
              return filterFields.every(filterField => photoPost[filterField] === filter[filterField]);
          });
          }
          if(filteredPhotoPosts.length > 1) filteredPhotoPosts.sort((a, b) => {return a.createdAt - b.createdAt});
          return filteredPhotoPosts.slice(skip, top);
      }
    
    
      postService.getPhotoPost = id => window.photoPosts.find(photoPost => photoPost.id === id);
    
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
          window.photoPosts.unshift(photoPost);
          return true;
      }
        return false;
      }
    
    
      postService.editPhotoPost = (id, editPost) => {
        let postToUpdate = postService.getPhotoPost(id);
        if (!postToUpdate) return false;
    
        const fieldsToUpdate = Object.keys(editPost);
        const validFields = fieldsToUpdate.filter(fieldToUpdate => {
            return window.SCHEMA.FIELDS_VALID_TO_UPDATE.indexOf(fieldToUpdate) !== -1;
        })
        if(validFields.length === 0) return false;
    
        validFields.forEach(fieldToUpdate => {
            postToUpdate[fieldToUpdate] = editPost[fieldToUpdate];
        });
    
        return postService.validatePhotoPost(postToUpdate);
      }
    
    
      postService.removePhotoPost = id => {
        const photoPost = postService.getPhotoPost(id);
        if (!photoPost) return false;
        window.photoPosts.splice(window.photoPosts.indexOf(photoPost), 1);
        return true;
      }
    
      postService.compareHashtag = (a, b) => {
        for(i = 0; i < a.length; i++) {
            if(b.indexOf(a[i]) === -1) return false;
          }
        return true;
      }

      window.postService = postService;
}(window.photoPosts, window.SCHEMA)