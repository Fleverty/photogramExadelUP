!function(domService, postService, photoPosts) {
    detailAddForm = () => {
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
                "<div class = \"addbutton\"><button>Add</button></div>" + 
                "<div class = \"canselbutton\"><button>Cansel</button></div>" +
              "</div></div></div></div>";
        document.body.innerHTML += detailAddForm;
        document.querySelector("div.canselbutton").addEventListener("click", deleteAddForm);
        document.querySelector("div.addbutton").addEventListener("click", addNewPost);
        
    }
    deleteAddForm = () => {
        document.body.removeChild(document.querySelector("div.addform"));
    }

    addNewPost = () => {
        let imagelink = document.querySelector("input.imagelink").value;
        let hashtag = [];
        hashtag =  document.querySelector("input.hashtag-input").value.split(", ");
        let description = document.querySelector('textarea.description-input').value;
        domService.addPost({id:'5', description: description, createdAt: new Date, author: domService.user, photoLink: imagelink, hashtags: hashtag, likes : []})
        deleteAddForm();
    }
    document.querySelector("div.btn").addEventListener("click", detailAddForm);

  }(window.domService, window.postService, window.photoPosts)