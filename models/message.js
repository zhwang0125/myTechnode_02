var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
    content: String,
    creator: {
        _id: ObjectId,
        email: String,
        name: String,
        avatarUrl: String
    },
    createAt: {type: Date, default: Date.now()}
});

module.exports = MessageSchema;