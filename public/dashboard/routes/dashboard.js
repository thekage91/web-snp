'use strict'

angular.module('mean.dashboard').config(['$stateProvider',

	function($stateProvider){

		$stateProvider
			.state('dashboard.index', {
				url: "/dashboard",
				templateUrl: '^/index.html'
		});

	}
]);