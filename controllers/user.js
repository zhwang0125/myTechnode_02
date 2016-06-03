var User = require('../models').User;
var gravatar = require('gravatar');

/**
 * ID查询
 * @param _userId
 * @param fn
 */
exports.findUserById = function (_userId, fn) {
    User.findById(_userId, fn);
};

/**
 * 查询或者创建
 * @param email
 * @param fn
 */
exports.findByEmailOrCreate = function (email, fn) {
    User.findOne({email: email}, function (err, user) {
        if (err) {
            return fn(err, null);
        }

        if (user) {
            return fn(null, user);
        }

        var userEntity = new User();
        userEntity.name = email.split('@')[0];
        userEntity.email = email;
        userEntity.avatarUrl = gravatar.url(email);
        userEntity.save(fn);
    });
};

/**
 * 修改online为true
 * @param _userId
 * @param fn
 */
exports.online = function (_userId, fn) {
    User.findOneAndUpdate({_id: _userId}, {$set: {online: true}}, fn);
};

/**
 * 修改online为false
 * @param _userId
 * @param fn
 */
exports.offline = function (_userId, fn) {
    User.findOneAndUpdate({_id: _userId}, {$set: {online: false}}, fn);
};

/**
 * 查询online为true的用户
 * @param fn
 */
exports.getOnlineUsers = function (fn) {
    User.find({online: true}, fn);
};