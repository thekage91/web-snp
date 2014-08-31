/**
 * Created by ugo on 7/21/14.
 */

angular.module('idAccumulatorService', [])
    // super simple service
    // each function returns a promise object




    .factory('IdAccumulator', function($http,$q) {
        function accumulate(patient,collection,id) {
            return $http.post('api/idAcc/'+patient,{ modelClass : collection, id : id})
        };

        return {

            accumulateIDfromAll : function(patient,hashWithElements) {

                var accumulateRequests = [],i=0;
                var currentData;

                var obj = {};
                obj.model = 'Upload';

                for(var key in hashWithElements)
                if(hashWithElements.hasOwnProperty(key)) {
                    console.log('accumulando ID elemento: ' + key);
                    console.log('accumulando ID id: ' + hashWithElements[key]._id);

                    obj.field = key;
                    obj.id = hashWithElements[key]._id;
                    accumulateRequests[i++] =  $http.post('/api/array/'+patient._id, obj);
                }

                return $q.all(accumulateRequests);
            } ,
            accumulate: accumulate
        }
    });
