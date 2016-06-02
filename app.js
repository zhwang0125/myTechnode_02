var express = require('express');
var app = express();
var port = 3000;
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

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
    store: new MongoStore({
        url: 'mongodb://localhost/technode'
    })
}));
app.use(express.static(path.join(__dirname, '/static')));
app.use(function (req, res) {
    res.sendfile(path.join(__dirname, '/static/index.html'));
});

var server = app.listen(port, function (err) {
    if (err) {
        return console.error("app start fail");
    }

    console.log("app start success and port " + port);
});

var socketIO = require('socket.io');
var io = socketIO.listen(server);
var User = require('./controllers/user').User;
var SYSTEM = {
    name: 'technode_机器人',
    avatarUrl: 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robot_icon.svg/220px-Robot_icon.svg.png'
};

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
            socket.broadcast.emit('messages.add', {
                content: user.name + '进入了聊天室',
                creator: SYSTEM,
                createAt: new Date()
            });
        }

    });
});