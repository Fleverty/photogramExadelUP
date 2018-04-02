!function() {

    class UserMapper {
  
      constructor() {
        this.db = require('diskdb');
        this.connect = this.db.connect(__dirname + '/../data', ['user']);
      }
      getCurrentUserFromDb() {
        return this.db.user.find();
      }
  
      setCurrentUserToDb(user) {
        if (!user) return;
  
        this.db.user.remove();
        this.db.loadCollections(['user']);
        this.db.user.save(user);
      }
  
      deleteCurrentUserFromDb() {
        this.db.user.remove();
        this.db.loadCollections(['user']);
      }
    }
  
    module.exports.userMapper = new UserMapper();
  }();