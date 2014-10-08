/**
 * Created by ugo on 7/21/14.
 */

angular.module('idAccumulatorService', [])
    // super simple service
    // each function returns a promise object



    .factory('IdAccumulator', function($http,$q,Model) {

        return {

            accumulateIDfromAll : function(hashWithElements,upload) {
                //console.log(hashWithElements);
                var accumulateRequests = [],i=0;
                    Object.keys(hashWithElements).forEach(function (key) {
                        if(key === 'Patient') return;
                        var obj = {};
                        obj.model = 'Upload';
                        obj.field = key;
                        obj.id = hashWithElements[key]._id;
                        console.log("obj: "); console.log(obj);
                        console.log("upload id: "+upload._id);
                        accumulateRequests.push($http.post('/api/array/'+upload._id, obj));
                    });
                return $q.all(accumulateRequests);
            }
        }
    });
