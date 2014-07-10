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

            .state('dashboard.userProfile', {
                url: '/userProfile',
                templateUrl: 'public/dashboard/views/partial_views/userProfile.html',
            })

            .state('dashboard.editProfile', {
                url: '/editProfile',
                templateUrl: 'public/dashboard/views/partial_views/editProfile.html',
            })

            .state('dashboard.form_upload', {
            	url: "/form_upload",
            	templateUrl: 'public/dashboard/views/partial_views/form_file_uploader.html'
            })
            
            .state('dashboard.authorizeUser', {
                url: '/authorizeUser',
                templateUrl: 'public/dashboard/views/partial_views/authorizeUser.html',
            })
            
            .state('dashboard.executeQuery', {
                url: '/executeQuery',
                templateUrl: 'public/dashboard/views/partial_views/executeQuery.html',
            })

            .state('dashboard.families', {
                url: '/families',
                templateUrl: 'public/dashboard/views/partial_views/families.html',
            })
            ;
    }
])

.controller('SidebarCtrl', function ($scope, $state) {

    $scope.setPage = function (page) {
        $state.transitionTo(page);
    }
});
