angular
    .module('techNodeApp')
    .controller('LoginCtrl', function ($scope, $http, $location) {
        $scope.login = function () {
            $http({
                url: '/login',
                method: 'post',
                data: {
                    email: $scope.email
                }
            }).success(function (user) {
                $scope.$emit('login', user);
                $location.path('/')
            }).error(function (data) {
                $location.path('/login');
            });
        };
    });
