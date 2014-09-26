/**
 * Created by ugo on 9/22/14.
 */
angular.module('QueryService', [])
    // super simple service
    // each function returns a promise object
    .factory('Query', function ($http, $q) {


        function jsonConcat(o1, o2) {
            for (var key in o2) if (o2.hasOwnProperty(key)) {
                o1[key] = o2[key];
            }
            return o1;
        }


        var retrieveRelationships = function (data) {
             var promises = [];
            var deferred;
            console.info(data.payload);
             data.payload.forEach(function (payload) {

                if (payload.variants) payload.variants.forEach(function (variant) {
                    $http.get('/api/variant/' + variant)
                        .success(function (data) {
                            console.log('Got variant1');
                            console.log(data);
                            var o1 = data.payload;
                            $http.get('/api/gene/' + o1.gene).success(function (data) {
                                deferred = $q.defer();
                                console.log('Got gene related to Variant');
                                var o2 = data.payload;
                                deferred.resolve(jsonConcat(o1, o2));
                                promises.push(deferred.promise);
                                console.info("promises length: " + promises.length);
                            })

                        })
                        .error(function (data) {
                            console.log('[ERROR] Failed retrieving variant  ith ID: ' + variant);
                        });
                });
                else
                    $http.get('/api/variant/' + payload.variant)
                        .success(function (data) {
                            console.log('Got variant');
                            console.log(data);
                            var o1 = data.payload;
                            $http.get('/api/gene/' + o1.gene).success(function (data) {
                                deferred = $q.defer();
                                console.log('Got gene related to Variant');
                                var o2 = data.payload;
                                deferred.resolve(jsonConcat(o1, o2));
                                promises.push(deferred.promise);
                                console.info("promises length: " + promises.length);
                            })

                        })
                        .error(function (data) {
                            console.log('[ERROR] Failed retrieving variant  ith ID: ' + variant);
                        });
            });
            return $q.all(promises);
        };


        return { submitQueryByElement: function (element, keyword) {

            var res = $q.defer();

            switch (element) {

                case 'genes':
                    $http.get('/api/gene/finder/query?' + element + '=' + keyword)
                        .success(function (data) {
                            console.log("Query:" + element + '=' + keyword);




                            retrieveRelationships(data).then(function (data) {
                                res.resolve(data)});
                        })
                        .error(function (data) {
                            console.error('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                            res.reject(data);
                        });
                    break;

                /*case 'freqAlt':
                case 'dbSNP':
                    console.log("query: " + element + '=' + keyword);
                    $http.get('/api/dbsnp/finder/query?' + element + '=' + keyword)
                        .success(function (data) {
                            console.log("QUERY SUCCEDED. RECEIVED:" + JSON.stringify(data));
                            res = retrieveRelationships(data);
                        })
                        .error(function (data) {
                            console.error('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                            res.reject(data);

                        });
                    break;
*/
            }
            return res.promise;
        },

            submitQueryByRegion :  function (chr,start,end) {
                var res = $q.defer();
                $http.get('/api/variant/finder/query?chr=' +
                    chr + '&start=' +
                    start + '&end=' + end)
                    .success(function (data) {
                        console.info("Retrieved this variant from range query: ")
                        console.info(data);
                        data.payload.forEach(function (o1) {
                            $http.get('/api/gene/' + o1.gene).success( function(data) {
                                console.log('Got gene related to Variant');
                                var o2 = data.payload;
                                res.resolve(jsonConcat(o1,o2));
                            })

                        })

                    }).error(function (data) {
                        console.log('[ERROR] Failed retrieving variant  ith ID: ' + variant);
                        res.reject(data);
                    });

                return res.promise;
            }


        }





    });