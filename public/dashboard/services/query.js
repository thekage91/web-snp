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
            var isRangeQuery = false;
            var firstQuery;

            switch (field) {
                case 'genes':
                    modelToQuery = 'gene';
                    break;
                case 'freqAlt':
                case 'freqRef':
                    isRangeQuery = true;
                case 'dbSNP':
                    modelToQuery = 'dbSNP';
                    break;
                default:
                    console.error("[ERROR] I don't know what to query for " + field);
                    return;
            }
            if(isRangeQuery) {
                var numberArray = keyword.trim().replace(/\s+/g, ' ').split(" ",2);
                if(numberArray[0] > numberArray[1]) numberArray.reverse();
                var queryString = '/api/' + modelToQuery + '/finder/'+field+'Range?gt=' + numberArray[0] + '&lt=' + numberArray[1];
                console.log("query: " + queryString);
                firstQuery = $http.get(queryString);
            }

            else firstQuery = $http.get('/api/' + modelToQuery + '/finder/query?' + field + '=' + keyword);


            firstQuery.then(function (respWithRows) {
                    loadVariants(respWithRows).then(function (arrayWithVariants) {
                        arrayWithVariants.forEach(function (response) {
                            var singleVariant = response.data.payload;
                            promises.push(getGeneAndConcat(singleVariant));
                        })
                        deferredResult.resolve($q.all(promises));
                    })
                });
            return deferredResult.promise;
        },

             submitByRegion :  function (chr,start,end) {
             var deferredResult = $q.defer();
             var promises = [];
             var arrayWithVariants;

             $http.get('/api/variant/finder/rangeQuery?chr='+chr+'&start='+start + '&end=' + end)
             .then(function (response) {
                     console.log(response);
                     arrayWithVariants = response.data.payload;
                         arrayWithVariants.forEach(function (singleVariant) {
                             promises.push(getGeneAndConcat(singleVariant));
                         });
                         deferredResult.resolve($q.all(promises));
                 })
                 return deferredResult.promise;
             }

        }

    });