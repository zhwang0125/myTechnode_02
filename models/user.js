var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: String,
    name: String,
    avatarUrl: String,
    online: Boolean
});

module.exports = UserSchema;