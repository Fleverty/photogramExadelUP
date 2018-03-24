!function(domService, postService, photoPosts) {
    detailSignForm = () => {
        let detailSignForm = "<div class = \"signform\">" + 
        "<div class = \"header-signform\">Sign in</div>" + 
        "<div class = \"main-signform\">" + 
            "<div class = \"loginform\"><div>Login : </div><input class=\"inputlogin\" type=\"text\" placeholder=\"Login...\"/></div>" + 
            "<div class = \"passwordform\"><div>Password : </div><input class=\"password\" type=\"text\" placeholder=\"Password...\"/></div>" +
        "</div>" +
        "<div class = \"okcansel\">" + 
            "<div class = \"addbutton\"><button>Sign in</button></div>"+
            "<div class = \"canselbutton\"><button>Cansel</button></div>"+
        "</div></div>";
        document.body.innerHTML += detailSignForm;
        document.querySelector("div.canselbutton").addEventListener("click", deleteSignForm);
        document.querySelector("div.addbutton").addEventListener("click", signIn);
        
    }
    deleteSignForm = () => {
        document.body.removeChild(document.querySelector("div.signform"));
    }

    signIn = () => {
        let user = document.querySelector("input.inputlogin").value;
        if(!document.querySelector("input.password").value === '1111') return false;
        domService.user = user;
        domService.userConfig(domService.user);
        deleteSignForm();
    }
    document.querySelector("div.login").addEventListener("click", detailSignForm);

  }(window.domService, window.postService, window.photoPosts)