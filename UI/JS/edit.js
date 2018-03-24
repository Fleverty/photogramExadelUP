!function(domService, postService) {
  domService.showPosts();
  domService.userConfig(domService.user);

  window.test = {};

  test.addPhotoPost =  (photoPost) => {domService.addPost(photoPost)};
  test.editPhotoPost = (id, editField) => {domService.editPost(id, editField)};
  test.removePhotoPost = (id) => {domService.deletePost(id)};
  
}(window.domService, window.postService)

