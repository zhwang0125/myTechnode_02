angular
    .module('techNodeApp', ['ngRoute'])
    .run(function ($window, $rootScope, $http, $location) {
        $location.path('/login')
    });