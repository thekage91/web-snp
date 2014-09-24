/**
 * Created by ugo on 9/22/14.
 */
angular.module('QueryService', [])
    // super simple service
    // each function returns a promise object
    .factory('Query', function ($http, $q,$rootScope,$timeout, Model) {
        var successInitialQuery = function (data) {
            $scope.elements = [];
            console.log("QUERY SUCCEDED. RECEIVED:" + JSON.stringify(data));

            data.payload.forEach(function (payload) {
                if (payload.variants) payload.variants.forEach(function (variant) {

                    $http.get('/api/variant/' + variant)
                        .success(function (data) {
                            console.log('Got variant');
                            console.log(data);
                            var o1 = data.payload;
                            $http.get('/api/gene/' + o1.gene).success( function(data) {
                                console.log('Got gene related to Variant');
                                var o2 = data.payload;
                                $scope.elements.push(jsonConcat(o1,o2))
                            })

                        })
                        .error(function () {
                            console.log('[ERROR] Failed retrieving variant  ith ID: ' + variant);
                        });
                });
                else
                    $http.get('/api/variant/' + payload.variant)
                        .success(function (data) {
                            console.log('Got variant');
                            console.log(data);
                            var o1 = data.payload;
                            $http.get('/api/gene/' + o1.gene).success( function(data) {
                                console.log('Got gene related to Variant');
                                var o2 = data.payload;
                                $scope.elements.push(jsonConcat(o1,o2))
                            })

                        })
                        .error(function () {
                            console.log('[ERROR] Failed retrieving variant  ith ID: ' + variant);
                        });
            });
        };


        return { submitQuery : function (element,keyword ) {


            switch (element) {

            case 'gene':
                $http.get('/api/gene/finder/query?' + element + '=' + keyword)
                    .success(successInitialQuery)
                    .error(function (data) {
                        console.log('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                    });
                break;

            case 'freqAlt':
            case 'dbSNP':
                $http.get('/api/dbsnp/finder/query?' + element + '=' + keyword)
                    .success(successInitialQuery)
                    .error(function (data) {
                        console.log('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                    });
                break;
        }
    }    }


    });