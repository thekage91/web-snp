/**
 * Created by ugo on 7/21/14.
 */

angular.module('idAccumulatorService', [])
    // super simple service
    // each function returns a promise object



    .factory('IdAccumulator', function($http,$q,Model) {
        function accumulate(patient,collection,id) {
            return $http.post('api/idAcc/'+patient,{ modelClass : collection, id : id})
        };

        return {

            accumulateIDfromAll : function(patient,hashWithElements,upload) {
                //console.log(hashWithElements);
                var accumulateRequests = [],i=0;
                var obj = {};
                obj.model = 'Upload';
                    Object.keys(hashWithElements).forEach(function (key) {
                        obj.field = key;
                        obj.id = hashWithElements[key]._id;
                        console.log("obj: "); console.log(obj);
                        console.log("upload id: "+upload._id);
                        accumulateRequests[i++] =  $http.post('/api/array/'+upload._id, obj);
                    });
                return $q.all(accumulateRequests);
            } ,
            accumulate: accumulate
        }
    });
