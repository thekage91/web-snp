/**
 * Created by ugo
 */

angular.module('FilterService', [])
    // super simple service
    // each function returns a promise object
    .factory('Filter', function ($http, $q,$rootScope,$timeout, Model) {

        function getOrInitDistinctWords() {
            var deferred = $q.defer();
            Model.getAll('Filter').then(function (response) {
                console.warn(response);
                var data = response.data.payload;
                if (data.length <= 0)
                    Model.create('Filter',{distinctWords : { 0:0}}).then(function (response) {

                        deferred.resolve(response.data.payload);
                    });
                else
                    deferred.resolve(data[0]);
                //console.log(data);
            }, function(error) { deferred.reject(error)});
            return deferred.promise;
        }


        return {
            updateDistinctValues: function (attributesArray, columnArray) {

                getOrInitDistinctWords().then(function (data) {

                    var distinctWords = data.distinctWords || {};
                    var id = data._id;
                    var word, modified = false;

                    attributesArray.forEach(function (singleList) {
                        columnArray.forEach(function (singleColumn) {
                            word = singleList[singleColumn];
                            distinctWords[singleColumn] = distinctWords[singleColumn] || [];
                            if (distinctWords[singleColumn].indexOf(word) < 0) {
                                distinctWords[singleColumn].push(word);
                                modified = true;
                                console.log('post modifica' + JSON.stringify(distinctWords)+ '\ne pure'+ JSON.stringify(distinctWords[singleColumn]) );
                            }
                        })
                    });
                        if (modified) Model.update('Filter', id,{distinctWords: distinctWords }).then(function (resp) {
                        console.log("Filter Updated with new words. response: ");
                        console.log(resp); })
                });

            },

            getDistinctValues: function(column) {
                var deferred = $q.defer();
                getOrInitDistinctWords().then( function (data) {
                    console.log("risposta da getOrInit")
                    console.log(data);
                    data.distinctWords[column] = data.distinctWords[column] || [];
                    deferred.resolve(data.distinctWords[column]);
                }, function(err) { deferred.reject(err)});
                return deferred.promise;
            }

        }
    });
