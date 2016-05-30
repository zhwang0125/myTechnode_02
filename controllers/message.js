var Message = require('../models').Message;

/**
 * 创建
 * @param message
 * @param fn
 */
exports.create = function (message, fn) {
    var message = new Message(message);
    message.save(fn);
};

/**
 * 查询
 * @param fn
 */
exports.read = function (fn) {
    Message.find({}, null, {sort: {createAt: 1}, limit: 20}, fn)
};