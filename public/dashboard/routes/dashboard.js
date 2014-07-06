'use strict';

//Setting up route
angular.module('mean.dashboard').config(['$stateProvider',
    function($stateProvider) {

        // states for my app
        $stateProvider
            .state('dashboard.index', {
				url: "/dashboard",
				templateUrl: 'public/dashboard/views/dashboard.html'
            })
            .state('dashboard.form_upload' , {
            	url: "form_upload",
            	templateUrl: 'public/dashboard/views/partial_view/form_file_uploader.html'
            });
        }
]);
