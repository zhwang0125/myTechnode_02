var mongoose = require('mongoose');
var UserSchema = require('./user');
var MessageSchema = require('./message');

mongoose.connect('mongodb://localhost/technode_02', function (err) {
    if (err) {
        console.error(err);
        process.exit(1);
        return;
    }

    console.log('mongoose start success');
});

exports.User = mongoose.model('User', UserSchema);
exports.Message = mongoose.model('Message', MessageSchema);