'use strict';

angular.module('mean.controllers.dashboard', [])

.controller('SidebarCtrl', function ($scope, $state) {

    $scope.setPage = function (page) {
        $state.transitionTo(page);
    }
});