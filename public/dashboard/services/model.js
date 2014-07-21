/**
 * Created by ugo on 7/21/14.
 */

angular.module('ModelService', [])
    // super simple service
    // each function returns a promise object
    .factory('Model', function($http,$q) {
        return {
            getAll : function(element) {
                return $http.get('/api/'+element);
            },
            create : function(element,todoData) {
                return $http.post('/api/'+element, todoData);
            },
            delete : function(element,id) {
                return $http.delete('/api/'+element +'/'+ id);
            },
            getSchema : function (element) {
                return $http.get('/api/model/'+element);
            },
            getAnId : function () {
                var resu;
                return $http.get('/api/id',{cache : 'false'}).success( function (res) { resu = res});
                return resu[0];
            },
            getAllSchemas : function () {

                var models = ['Variant', 'VariantDetail', 'Gene', 'DbSNP', 'Pathogenicity', 'Esp', 'Patient'];
                var requests = [];
                for(var i=0;i<models.length; i++) {
                    requests[i] = $http.get('/api/model/'+models[i]);
                }
            return $q.all(requests);

            },
            getANumberOfIds : function (num) {
                while(num) {
                    equests[i] = $http.get('/api/id');
                    num--;
                }
                return $q.all(requests);
            }

        }
    });
