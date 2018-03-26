!function(domService, postService) {
   
    let pageListener = {};

    pageListener.detailAddForm = () => {
        let detailAddForm = "<div class = \"addform\">" + 
        "<div class = \"header-addform\"> Add new post</div>" + 
        "<div class = \"main-addform\">" + 
          "<div class = \"label-1\">" +
            "<div class = \"image\">" + 
              "<input class=\"imagelink\" type=\"text\" placeholder=\"Link...\"/>" + 
              "<input type = \"button\" value = \"Submit\" class = \"submit\">"  +
            "</div>" +
            "<input class=\"hashtag-input\" type=\"text\" placeholder=\"Hashtags...\"/>" + 
            "<textarea class=\"description-input\" placeholder=\"Write something about photo...\"></textarea>" + 
          "</div>" +
          "<div class = \"label-2\">" + 
              "<div class=\"detail-news-photo\"><img src = \"https://st2.depositphotos.com/1950939/7068/v/950/depositphotos_70683277-stock-illustration-grey-strokes-background.jpg\">" +
              "</div>" + 
              "<div class = \"okcansel\">" + 
                "<div class = \"addbutton\" onclick = 'pageListener.addNewPost()'><button>Add</button></div>" + 
                "<div class = \"canselbutton\" onclick = 'pageListener.deleteAddForm()'><button>Cansel</button></div>" +
              "</div></div></div></div>";
        document.body.innerHTML += detailAddForm;
    }

    pageListener.deleteAddForm = () => {
        document.body.removeChild(document.querySelector("div.addform"));
    }

    pageListener.addNewPost = () => {
        let imagelink = document.querySelector("input.imagelink").value;
        let hashtag = [];
        hashtag =  document.querySelector("input.hashtag-input").value.split(", ");
        let description = document.querySelector('textarea.description-input').value;
        if(imagelink === "" || description === "") {
            return false;
        }
        domService.addPost({id:'5', description: description, createdAt: "2018-12-23", author: domService.user, photoLink: imagelink, hashtags: hashtag, likes : []})
        pageListener.deleteAddForm();
    }
    

    pageListener.pagination = () => {
        let skip = document.querySelectorAll("div.post").length;
        domService.showPosts(skip, skip + 10);
    }

    pageListener.deletePost = (event) => {
        let target = event.target;
        while(target.className !== 'post') target = target.parentNode;
        domService.deletePost(target.id);
    }

    pageListener.detailSignForm = () => {
        let detailSignForm = "<div class = \"signform\">" + 
        "<div class = \"header-signform\">Sign in</div>" + 
        "<div class = \"main-signform\">" + 
            "<div class = \"loginform\"><div>Login : </div><input class=\"inputlogin\" type=\"text\" placeholder=\"Login...\"/></div>" + 
            "<div class = \"passwordform\"><div>Password : </div><input class=\"password\" type=\"password\" placeholder=\"Password...\"/></div>" +
        "</div>" +
        "<div class = \"okcansel\">" + 
            "<div class = \"addbutton\" onclick = 'pageListener.signIn()'><button>Sign in</button></div>"+
            "<div class = \"canselbutton\" onclick = 'pageListener.deleteSignForm()'><button>Cansel</button></div>"+
        "</div></div>";
        document.body.innerHTML += detailSignForm;
        
    }

    pageListener.deleteSignForm = () => {
        document.body.removeChild(document.querySelector("div.signform"));
    }

    pageListener.signIn = () => {
        let user = document.querySelector("input.inputlogin").value;
        if(!document.querySelector("input.password").value === '1111') {
            return false;
        }
        if(user === "") {
            return false;
        } 
        domService.user = user;
        domService.userConfig(domService.user);
        pageListener.deleteSignForm();
    }

    pageListener.filterByAuthor = () => {
        let author = document.querySelector("select.author-select").value;
        domService.clean();
        domService.showPosts(0, 10, {author: author});
        domService.userConfig(domService.user);
    }

    pageListener.filterByHashtags = () => {
        let hashtags = [];
        hashtags = document.querySelector("input.search-hashtags").value.split(', ');
        domService.clean();
        domService.showPosts(0, 10, {hashtags: hashtags});
        domService.userConfig(domService.user);
    }

    pageListener.filterByDate = () => {
        let date = document.querySelector("input.date-search").value;
        domService.clean();
        domService.showPosts(0, 10, {createdAt: date});
        domService.userConfig(domService.user);
    }

    pageListener.detailEditForm = (event) => {
        let target = event.target;
        while(target.className !== 'post') {
            target = target.parentNode;
        }
        let photoPost = postService.getPhotoPost(target.id);
        let description = photoPost.description;
        let hashtags = photoPost.hashtags.join(', ');
        
        let detailEditForm = "<div class = \"addform\">" + 
        "<div class = \"header-addform\"> Edit post</div>" + 
        "<div class = \"main-addform\">" + 
          "<div class = \"label-1\">" +
            "<div class = \"image\">" + 
              "<input class=\"imagelink\" type=\"text\" value =" + photoPost.photoLink +" >" + 
              "<input type = \"button\" value = \"Submit\" class = \"submit\">"  +
            "</div>" +
            "<input class=\"hashtag-input\" type=\"text\" placeholder=\"Hashtags...\" value = " +hashtags  + ">" + 
            '<textarea class="description-input" value ="' + description  +'" ></textarea>' + 
          "</div>" +
          "<div class = \"label-2\">" + 
              "<div class=\"detail-news-photo\"><img src = " + photoPost.photoLink + ">" +
              "</div>" + 
              "<div class = \"okcansel\">" + 
                "<div class = \"addbutton\" onclick = pageListener.editPost(" + target.id +")><button>Edit</button></div>" + 
                "<div class = \"canselbutton\" onclick = 'pageListener.deleteAddForm()'><button>Cansel</button></div>" +
              "</div></div></div></div>";

        document.body.innerHTML += detailEditForm;
    }

    pageListener.editPost = (id) => {
        id = "" + id;
        let imagelink = document.querySelector("input.imagelink").value;
        let hashtag = [];
        hashtag =  document.querySelector("input.hashtag-input").value.split(', ');
        let description = document.querySelector('textarea.description-input').value;
        if(imagelink === "" || description === "") return false;
        domService.editPost(id,{description: description, photoLink: imagelink, hashtags: hashtag})
        pageListener.deleteAddForm();
    }


    window.pageListener = pageListener;
}(window.domService, window.postService)