/**
 * Created by ugo
 */

angular.module('FilterService', [])
    // super simple service
    // each function returns a promise object
    .factory('Filter', function ($http, $q, Model) {

        function initializeDistinctValues() {
            var deferred = $q.defer();
            Model.getAll('Filter').then(function (response) {
                var data = response.data.payload;
                if (data.length <= 0)
                    Model.create('Filter').then(function (response) {
                        //need to wrap data in array for response differences beetween POST and GET
                        deferred.resolve([response.data.payload])
                    });
                else
                    deferred.resolve(data);
                console.log(data);
            })
            return deferred.promise;
        }


        return {
            updateDistinctValues: function (attributesArray, columnArray) {

                initializeDistinctValues().then(function (data) {

                    var distinctWords = data[0].filter || {};
                    var id = data[0]._id;
                    var word,existentWords, modified = false;


                    attributesArray.forEach(function (singleList) {
                        columnArray.forEach(function (singleColumn) {
                            word = singleList[singleColumn];
                            distinctWords[singleColumn] = distinctWords[singleColumn] || [];

                            if (distinctWords[singleColumn].indexOf(word) < 0) {
                                distinctWords[singleColumn].push(word);
                                modified = true;
                            }
                        })
                    })
                    console.log('Oggetto con le parole; ');
                    console.log(distinctWords);
                    if (modified) Model.update('Filter', id, {filter: distinctWords}).then(function (resp) {
                        console.log("Filter Updated with new words. response: ");
                        console.log(resp);
                    })
                });

            },

            getDistinctValues: function (column) {
                return values[column];
            }

        }
    });
