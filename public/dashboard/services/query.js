/**
 * Created by ugo on 9/22/14.
 */
angular.module('QueryService', [])// super simple service
    // each function returns a promise object
    .factory('Query', function ($http, $q) {

        function jsonConcat(o1, o2) {
            for (var key in o2) if (o2.hasOwnProperty(key)) {
                o1[key] = o2[key];
            }
            return o1;
        }

        var getGeneAndConcat = function (obj1) {
            var deferredResult = $q.defer();
            $http.get('/api/gene/' + obj1.gene).success(function (responseWithGene) {
                var gene = responseWithGene.payload;
                deferredResult.resolve(jsonConcat(obj1, gene));
            }).error(function (err) {
                deferredResult.reject(err)
            });
            return deferredResult.promise;
        }

        var loadVariants = function (response) {
            var promises = [];
            var rows = response.data.payload;
            rows.forEach(function (row) {
                var variantsIDArray = [];
                if (!(row.variants))
                    variantsIDArray.push(row.variant); else
                    variantsIDArray = row.variants;
                variantsIDArray.forEach(function (variantID) {
                    promises.push($http.get('/api/variant/' + variantID));

                });

            })
            return $q.all(promises);
        }

        return { submitQueryByElement: function (field, keyword) {

            var modelToQuery;
            var promises = [];
            var deferredResult = $q.defer();

            switch (field) {
                case 'genes':
                    modelToQuery = 'gene';
                    break;
                case 'freqAlt':
                case 'dbSNP':
                    modelToQuery = 'dbSNP';
                    break;
                default:
                    console.error("[ERROR] I don't know what to query for " + field);
                    return;
            }
            $http.get('/api/' + modelToQuery + '/finder/query?' + field + '=' + keyword).then(function (respWithRows) {
                    //console.info(loadVariants(respWithRows));
                    loadVariants(respWithRows).then(function (arrayWithVariants) {
                        arrayWithVariants.forEach(function (response) {
                            var singleVariant = response.data.payload;
                            promises.push(getGeneAndConcat(singleVariant));
                            console.info(promises);
                        })
                        deferredResult.resolve($q.all(promises));
                    })
                });
            return deferredResult.promise;
        }





            /*,

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
             */

        }

    });