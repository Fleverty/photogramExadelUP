!function(domService, postService) {
    filterByAuthor = () => {
        let author = document.querySelector("select.author-select").value;
        domService.clean();
        domService.showPosts({author: author});
        domService.userConfig(domService.user);
    }

    document.querySelector("input.submit-author").addEventListener("click", filterByAuthor);
  }(window.domService, window.postService)
  