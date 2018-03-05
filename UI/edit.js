const SCHEMA = {
  PHOTOPOST:  {
    ID: {
      NAME: 'id',
      TYPE: 'string'
    },
    DESCRIPTION: {
      NAME: 'description',
      TYPE: 'string'
    },
    CREATEDAT: {
      NAME: 'createdAt',
      TYPE: 'object'
    },
    AUTHOR: {
      NAME: 'author',
      TYPE: 'string'
    },
    PHOTOLINK: {
      NAME: 'photoLink',
      TYPE: 'string'
    },
    HASHTAGS: {
      NAME: 'hashtags',
      TYPE: 'object'
    },
    LIKES: {
      NAME: 'likes',
      TYPE: 'object'
    }
  },
  FIELDS_VALID_TO_FILTER: ['createdAt', 'author', 'hashtags'],
  FIELDS_VALID_TO_UPDATE: ['description', 'photoLink', 'hashtags'],
}

  var photoPosts = [
    {
      id: '1',
      description: 'Женская сборная Беларуси выиграла эстафету в рамках соревнований по биатлону на Олимпийских играх в Пхёнчхане!!!',
      createdAt: new Date('2019-02-23T23:00:00'),
      author: 'Петров Пётр',
      photoLink: 'http://ont.by/webroot/delivery/files/news/2018/02/22/Dom.jpg',
      hashtags : ["kek", "cheburek", 'lol', 'hah'],
      likes: ['Иванов Иван', 'Jack Daniels'],
    },
    {
      id: '2',
      description: 'Женская сборная Беларуси выиграла эстафету в рамках соревнований по биатлону на Олимпийских играх в Пхёнчхане!!!',
      createdAt: new Date,
      author: 'Иванов Иван',
      photoLink: 'http://ont.by/webroot/delivery/files/news/2018/02/22/Dom.jpg',
      hashtags: ['kek', 'lol', 'cheburek', 'hah'],
      likes: ['Иванов Иван', 'Jack Daniels'],
    },
  ];


  getPhotoPosts = (skip = 0, top = 10, filter) => {
    if (!filter){
      photoPosts.sort((a, b) => {return a.createdAt - b.createdAt})
      return photoPosts.slice(skip, top);
    } 
  
      const filterFields = Object.keys(filter).filter(filterField => {
          return SCHEMA.FIELDS_VALID_TO_FILTER.indexOf(filterField) !== -1
      });

      if(filterFields.indexOf("hashtags") !== -1){
        var filteredByHashtag = photoPosts.filter(photoPost => {
          return  compareHashtag(filter.hashtags, photoPost.hashtags);
        } )
        filterFields.splice(filterFields.indexOf("hashtags"), 1);
        var filteredPhotoPosts = filteredByHashtag.filter(photoPost => {
          return filterFields.every(filterField => photoPost[filterField] === filter[filterField]);
        });
      }

      
      if(filterFields.indexOf("hashtags") === -1){
        const filteredPhotoPosts = photoPosts.filter(photoPost => {
          return filterFields.every(filterField => photoPost[filterField] === filter[filterField]);
      });
      }
      if(filteredPhotoPosts.length > 1) filteredPhotoPosts.sort((a, b) => {return a.createdAt - b.createdAt});
      return filteredPhotoPosts.slice(skip, top);
  }


  getPhotoPost = id => photoPosts.find(photoPost => photoPost.id === id);


  validatePhotoPost = photoPost => {
    const fieldsToValidate = Object.keys(SCHEMA.PHOTOPOST);
    const photoPostFields = Object.keys(photoPost);

    return fieldsToValidate.every(fieldToValidate => {
            return photoPostFields.indexOf(SCHEMA.PHOTOPOST[fieldToValidate].NAME) !== -1 && 
              (typeof photoPost[SCHEMA.PHOTOPOST[fieldToValidate].NAME]) === SCHEMA.PHOTOPOST[fieldToValidate].TYPE;
          });
  }


  addPhotoPost = photoPost => {
    if(validatePhotoPost(photoPost)) {
      photoPosts.unshift(photoPost);
      return true;
  }
    return false;
  }


  editPhotoPost = (id, editPost) => {
    let postToUpdate = getPhotoPost(id);
    if (!postToUpdate) return false;

    const fieldsToUpdate = Object.keys(editPost);
    const validFields = fieldsToUpdate.filter(fieldToUpdate => {
        return SCHEMA.FIELDS_VALID_TO_UPDATE.indexOf(fieldToUpdate) !== -1;
    })
    if(validFields.length === 0) return false;

    validFields.forEach(fieldToUpdate => {
        postToUpdate[fieldToUpdate] = editPost[fieldToUpdate];
    });

    return validatePhotoPost(postToUpdate);
  }


  removePhotoPost = id => {
    const photoPost = getPhotoPost(id);
    if (!photoPost) return false;
    photoPosts.splice(photoPosts.indexOf(photoPost), 1);
    return true;
  }

  compareHashtag = (a, b) => {
    for(i = 0; i < a.length; i++) {
        if(b.indexOf(a[i]) === -1) return false;
      }
    return true;
  }
  



console.log(getPhotoPosts());
console.log(getPhotoPosts(0, 10, {hashtags: ["lol", "hah"], author: "Иванов Иван"}));
console.log(getPhotoPosts(0, 10, {hashtags: ["lol"]}));
console.log(getPhotoPost('1'));
console.log(validatePhotoPost(photoPosts[1]));
console.log(validatePhotoPost({author:';lol'}));
console.log(addPhotoPost({author:';lol'}));
console.log(addPhotoPost(photoPosts[1]));
console.log(photoPosts);
console.log(removePhotoPost('1'));
console.log(photoPosts);
console.log(removePhotoPost('3'));
console.log(editPhotoPost('1', { photoLink: 'http://haradok.info/static/news/5/4565/preview.jpg' }));
console.log(getPhotoPost('1'));


