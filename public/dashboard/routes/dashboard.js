'use strict'

angular.module('mean.dashboard').config(['$stateProvider',

	function($stateProvider){

		$stateProvider
			.state('dashboard.dashboard', {
				url: '/dashboard',
				templateUrl: ''
		});

	}
]);