'use strict';

//Setting up route
angular.module('mean.system').config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // For unmatched routes:
            $urlRouterProvider.otherwise('/');

            // states for my app
            $stateProvider              
                .state('home', {
                    url: '/',
                    templateUrl: 'public/system/views/index.html'
                })
                .state('auth', {
                    templateUrl: 'public/auth/views/index.html'
                })
                .state('info', {
                    url: '/info',
                    templateUrl: 'public/system/views/info.html'
                })
                .state('aboutUs', {
                    url: '/aboutUs',
                    templateUrl: 'public/system/views/aboutUs.html'
                })
                .state('dashboard',{
                    templateUrl: 'public/dashboard/views/index.html'
                });
        }
    ])
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);
