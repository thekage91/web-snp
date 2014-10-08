/**
 * Created by ugo on 7/21/14.
 */

angular.module('ModelService', [])
    // super simple service
    // each function returns a promise object
    .factory('Model', function($http,$q) {

        var   create  =  function(element,data) {
            return $http.post('/api/'+element, data);
        }

        return {
            getAll : function(element) {
                return $http.get('/api/'+element);
            },
            create : create,
            update: function (element,id,data) {
                return $http.post('/api/'+element+'/'+id, data);
            },
            delete : function(element,id) {
                return $http.delete('/api/'+element +'/'+ id);
            },
            getSchema : function (element) {
                return $http.get('/api/model/'+element);
            },
            getAllSchemas : function () {

                var models = ['Variant', 'VariantDetail', 'Gene', 'DbSNP', 'Pathogenicity', 'Esp'];
                var requests = [];
                for(var i=0;i<models.length; i++) {
                    requests[i] = $http.get('/api/model/'+models[i]);
                }
            return $q.all(requests);

            },
            resolveDeferredFromDataPOST : function (pathElement,data,deferred) {
                (create(pathElement, data)).success(
                function (res) {
                    console.log("Resolving deferred from "+pathElement+" with " + JSON.stringify(res.payload)) ;
                    deferred.resolve(res.payload);
                }).error(
                function (err) {
                    console.error("ERROR while saving " +pathElement + JSON.stringify(err));
                    deferred.reject(err);
                });
                return deferred.promise;
        },

            createRelationship : function (documentID,field,IDtoAdd,modelName) {
            var obj = {};
            obj.field = field;
            obj.id = IDtoAdd;
            obj.model = modelName;
            return $http.post('/api/array/'+documentID, obj);
        }
        }
    });
