
angular
    .module('techNodeApp')
    .controller('RoomCtrl', function ($scope, socket) {
        // 读取在线人数
        socket.on('technode.read', function (technode) {
            $scope.technode = technode;
        });
        socket.emit('technode.read');

        // 用户进入聊天室
        socket.on('users.add', function(user) {
            $scope.technode.users.push(user);
        });

        // 添加消息
        socket.on('message.add', function (message) {
            $scope.technode.messages.push(message);
        });

        // 移除指定用户
        socket.on('users.remove', function (user) {
            var _id = user._id;

            $scope.technode.users = $scope.technode.users.filter(function (item) {
                return item._id !== _id
            });
        });
    });

angular
    .module('techNodeApp')
    .controller('MessageCreatorCtrl', function ($scope, socket) {
        // 发消息
        $scope.sendMessage = function () {
            socket.emit('message.create', {
                content: $scope.newMessage,
                creator: $scope.me
            });

            $scope.newMessage = '';
        };
    });