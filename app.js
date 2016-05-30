var express = require('express');
var app = express();
var port = 3000;
var path = require('path');

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