'use strict';
angular.module('mockgramApp').controller('NavbarController', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (location) {
        return location === $location.path();
    }
}]);