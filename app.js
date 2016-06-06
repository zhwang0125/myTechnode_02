var express = require('express');
var app = express();
var port = 3000;
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var socketIO = require('socket.io');
var User = require('./controllers').User;
var Message = require('./controllers').Message;
var signedCookieParser = cookieParser('technode');
var SYSTEM = {
    name: 'technode_机器人',
    avatarUrl: 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robot_icon.svg/220px-Robot_icon.svg.png'
};
var sessionStore = new MongoStore({
    url: 'mongodb://localhost/technode_02'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'technode',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000
    },
    store: sessionStore
}));
app.use(express.static(path.join(__dirname, '/static')));

/**
 * 验证
 */
app.post('/validate', function (req, res, next) {
    var _userId = req.session._userId;

    if (!_userId) {
        return res.status(401).json(null)
    }

    User.findUserById(_userId, function (err, user) {
        if (err) {
            return res.json(401, {
                err: msg
            });
        }

        res.json(user);
    });
});

/**
 * 登陆
 */
app.post('/login', function (req, res) {
    var email = req.body.email;

    User.findByEmailOrCreate(email, function (err, user) {
        if (err) {
            return res.json(500, {
                msg: err
            });
        }

        req.session._userId = user._id;
        User.online(user._id, function (err, user) {
            if (err) {
                return res.json(500, {
                    msg: err
                });
            }

            res.json(user);
        });
    });
});

app.use(function (req, res) {
    res.sendfile(path.join(__dirname, '/static/index.html'));
});

var server = app.listen(port, function (err) {
    if (err) {
        return console.error("app start fail");
    }

    console.log("app start success and port " + port);
});

var io = socketIO.listen(server);

io.set('authorization', function (handshakeData, accept) {
    signedCookieParser(handshakeData, {}, function (err) {
        if (err) {
            accept(err, false)
        } else {
            sessionStore.get(handshakeData.signedCookies['connect.sid'], function (err, session) {
                if (err) {
                    accept(err.message, false)
                } else {
                    handshakeData.session = session;
                    if (session._userId) {
                        accept(null, true)
                    } else {
                        accept('No login')
                    }
                }
            })
        }
    })
});

io.sockets.on('connection', function (socket) {
    var _userId = socket.request.session._userId;

    User.online(_userId, function (err, user) {
        if (err) {
            socket.emit('err', {
                msg: err
            });
        }
        else {
            socket.broadcast.emit('users.add', user);
            socket.broadcast.emit('message.add', {
                content: user.name + '进入了聊天室',
                creator: SYSTEM,
                createAt: new Date()
            });
        }

    });

    // 在线人数
    socket.on('technode.read', function () {
        User.getOnlineUsers(function (err, users) {

            socket.emit('technode.read', {
                users: users,
                messages: []
            });
        });
    });

    // 断开连接
    socket.on('disconnect', function () {
        User.offline(_userId, function (err, user) {
            if (err) {
                return socket.emit('err', {
                    msg: err
                });
            }

            // 通知其他用户，该用户下线了
            socket.broadcast.emit('users.remove', user);
            socket.broadcast.emit('message.add', {
                content: user.name + '离开了聊天室',
                creator: SYSTEM,
                createAt: new Date()
            });
        });
    });

    // 发送消息
    socket.on('message.create', function (message) {
        Message.create(message, function (err, message) {
            if(err){
                return socket.emit('err', {
                    msg: err
                });
            }

            io.sockets.emit('message.add', message);
        });
    });
});