angular
    .module('techNodeApp')
    .controller('RoomCtrl', function ($scope, socket) {
        socket.on('technode.read', function (technode) {
            $scope.technode = technode;
        });
        socket.emit('technode.read');

        socket.on('users.add', function(user) {
            $scope.technode.users.push(user);
        });
    });