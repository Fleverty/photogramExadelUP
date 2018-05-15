(function () {
  const postService = {};

  postService.getPhotoPosts = (skip = 0, top = 10, filter) => {
    if (!filter) {
      window.photoPosts.sort((a, b) => b.createdAt - a.createdAt);
      return window.photoPosts.slice(skip, top);
    }
    const filterFields = Object.keys(filter).filter(filterField => (window.SCHEMA.FIELDS_VALID_TO_FILTER.indexOf(filterField) !== -1 && filter[filterField] !== ''));

    /* return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
  xhr.open('POST', `/filter?skip=${skip}&top=${top}&filterFields=${filterFields.join(',')}`, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status} : ${xhr.responseText || xhr.statusText}`);
          reject(new Error('something bad happened'));
        } else {
          resolve(JSON.parse(xhr.responseText, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
          }));
        }
      };
      xhr.send(JSON.stringify(filter));
    }); */
    let filteredPhotoPosts = [];

    if (filter.hashtags[0] === '') {
      filterFields.splice(filterFields.indexOf('hashtags'), 1);
    }

    filteredPhotoPosts = window.photoPosts.filter(photoPost =>
      filterFields.every((filterField) => {
        console.log(filterField);
        if (filterField === 'hashtags') {
          if (postService.compareHashtag(filter[filterField], photoPost[filterField])) return true;
          return false;
        }
        if (filterField === 'createdAt') {
          console.log(postService.dateToString(photoPost));
          console.log(filter[filterField]);
          if (postService.dateToString(photoPost) === filter[filterField]) return true;
          return false;
        }
        if (photoPost[filterField] === filter[filterField]) return true;
        return false;
      }));

    if (filteredPhotoPosts.length > 1) {
      filteredPhotoPosts.sort((a, b) => b.createdAt - a.createdAt);
    }
    return filteredPhotoPosts.slice(skip, top);
  };

  postService.getPhotoPost = (id) => {
    return new Promise((resolve, reject) => {
      if (!id) {
        return;
      }
      xhr.send(JSON.stringify(filter));
    })

      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/posts/${id} `, false);

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          console.log(`${xhr.status} : ${xhr.responseText || xhr.statusText}`);
          reject(new Error('something bad happened'));
        } else {
          resolve(JSON.parse(xhr.responseText, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
          }));
        }
      };
      xhr.send();
    });
  };

  postService.validatePhotoPost = (photoPost) => {
    const fieldsToValidate = Object.keys(window.SCHEMA.PHOTOPOST);
    const photoPostFields = Object.keys(photoPost);

    return fieldsToValidate.every((fieldToValidate) => {
      return photoPostFields.indexOf(window.SCHEMA.PHOTOPOST[fieldToValidate].NAME) !== -1 &&
      (typeof photoPost[window.SCHEMA.PHOTOPOST[fieldToValidate].NAME]) ===
      window.SCHEMA.PHOTOPOST[fieldToValidate].TYPE;
    });
  };

  postService.addPhotoPost = (photoPost) => {
    return new Promise((resolve, reject) => {
      if (!postService.validatePhotoPost(photoPost)) {
        reject(new Error('something bad happened'));
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/addPhotoPost', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status !== 200) {
          console.log(`${xhr.status} : ${xhr.responseText || xhr.statusText}`);
          reject(new Error('something bad happened'));
        } else {
          resolve(true);
        }
      };
      xhr.send(JSON.stringify(photoPost));
    });
  };

  postService.editPhotoPost = async (id, editPost) => {
    const postToUpdate = await postService.getPhotoPost(id);
    if (!postToUpdate) {
      return false;
    }

    const fieldsToUpdate = Object.keys(editPost);

    const validFields = fieldsToUpdate.filter((fieldToUpdate) => {
      return window.SCHEMA.FIELDS_VALID_TO_UPDATE.indexOf(fieldToUpdate) !== -1;
    });

    if (validFields.length === 0) {
      return false;
    }

    validFields.forEach((fieldToUpdate) => {
      postToUpdate[fieldToUpdate] = editPost[fieldToUpdate];
    });
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `/editPhotoPost/${id} `, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status !== 200) {
          console.log(`${xhr.status} : ${xhr.responseText || xhr.statusText}`);
          reject(new Error('something bad happened'));
        } else {
          resolve(postService.validatePhotoPost(postToUpdate));
        }
      };
      xhr.send(JSON.stringify(postToUpdate));
    });
  };


  postService.removePhotoPost = (id) => {
    return new Promise((resolve, reject) => {
      const photoPost = postService.getPhotoPost(id);
      if (!photoPost) {
        return false;
      }
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', `/removePhotoPost/${id} `, false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status !== 200) {
          console.log(`${xhr.status} : ${xhr.responseText || xhr.statusText}`);
          reject(new Error('something bad happened'));
        } else {
          resolve(true);
        }
      };
      xhr.send(id);
    });
  };

  postService.compareHashtag = (a, b) => {
    for (let i = 0; i < a.length; i += 1) {
      if (b.indexOf(a[i]) === -1) return false;
    }
    return true;
  };

  postService.liking = async (id, user) => {
    const arrLikes = await postService.getPhotoPost(id);
    const oldUSer = arrLikes.likes.find(element => element === user);
    if (oldUSer === undefined) {
      arrLikes.likes.push(user);
    } else {
      arrLikes.likes.pop(user);
    }
    const array = arrLikes.likes;
    console.log(array + 2);
    return array;
  };

  postService.dateToString = (photoPost) => {
    const date = photoPost.createdAt.getDate() > 10 ? photoPost.createdAt.getDate() : `0${photoPost.createdAt.getDate()}`;
    const month = (+photoPost.createdAt.getMonth() + 1) > 10 ? (+photoPost.createdAt.getMonth() + 1) : `0${(+photoPost.createdAt.getMonth() + 1)}`;
    const year = photoPost.createdAt.getFullYear();
    return `${year}-${month}-${date}`;
  };

  window.postService = postService;
}());
