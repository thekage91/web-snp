'use strict';

//Setting up route
angular.module('mean.dashboard').config(['$stateProvider',
    function($stateProvider) {

        // states for my app
        $stateProvider
            .state('dashboard.index', {
            	name: 'dashboard.index',
				url: "/dashboard",
				templateUrl: 'public/dashboard/views/index.html'
            })

            //Per le partial views
            .state('dashboard.home', {
                url: '/home',
                templateUrl: 'public/dashboard/views/partial_views/partial-home.html',
            })

            .state('dashboard.form_upload', {
            	url: "/form_upload",
            	templateUrl: 'public/dashboard/views/partial_views/form_file_uploader.html'
            });
    }
])

.controller('SidebarCtrl', function ($scope, $state) {

    $scope.setPage = function (page) {
        $state.transitionTo(page);
    }
});
