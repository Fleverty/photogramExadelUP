!function () {

    class DataMapper {
  
      constructor() {
        this.db = require('diskdb');
        this.connect = this.db.connect(__dirname + './data', ['posts']);
      }
  
      setPostsToDb(articles) {
        this.db.posts.remove();
        this.db.loadCollections(['articles']);
        if (posts.length == 0) return;
        this.db.posts.save(articles);
      }
  
      getPost(id) {
        return this.db.posts.findOne({id: id});
      }
  
      loadPosts() {
        this.db.loadCollections(['posts']);
        return this.db.posts.find();
      }
    }
  
    module.exports.dataMapper = new DataMapper();
  }();