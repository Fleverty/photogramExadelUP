let photoPosts = [];

const xhr = new XMLHttpRequest();
xhr.open('GET', '/posts', false);
xhr.send();
if (xhr.responseText) {
  photoPosts = JSON.parse(xhr.responseText, (key, value) => {
    if (key === 'createdAt') return new Date(value);
    return value;
  });
}


photoPosts.indexOf = (element) => {
  for (let i = 0; i < photoPosts.length; i += 1) {
    if (JSON.stringify(photoPosts[i]) === JSON.stringify(element)) return i;
  }
  return -1;
};

window.photoPosts = photoPosts;
