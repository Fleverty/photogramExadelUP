!function(window, AddNewPostComponent) {

    class AddNewPostContainer {
        addButtonClicked() {

        }

        cancelButtonClicked() {}

        render() {
            new AddNewPostComponent(this.addButtonClicked, this.cancelButtonClicked);
        }
    }
}(window, window.AddNewPostComponent);
