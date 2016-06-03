angular
    .module('techNodeApp', ['ngRoute'])
    .run(['$window', '$rootScope', '$http', '$location', function ($window, $rootScope, $http, $location) {

        $http({
            url: '/validate',
            method: 'post'
        }).success(function (user) {
            $rootScope.me = user;
            $location.path('/');
        }).error(function (data) {
            $location.path('/login');
        });

        $rootScope.$on('login', function (evt, me) {
            $rootScope.me = me;
        });
    }]);