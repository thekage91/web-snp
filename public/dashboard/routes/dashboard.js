'use strict';

//Setting up route
angular.module('mean.auth').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is not conntected
        var checkLoggedOut = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }

                // Not Authenticated
                else $timeout(deferred.resolve);
            });

            return deferred.promise;
        };

        // states for my app
        $stateProvider
            .state('dashboard.index', {
				url: "/dashboard",
				templateUrl: 'public/dashboard/views/dashboard.html'
            });
    }
]);
