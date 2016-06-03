angular
    .module('techNodeApp', ['ngRoute'])
    .run(['$window', '$rootScope', '$http', '$location', function ($window, $rootScope, $http, $location) {
        $location.path('/login');

        $rootScope.$on('login', function (evt, me) {
            $rootScope.me = me;
        });
    }]);