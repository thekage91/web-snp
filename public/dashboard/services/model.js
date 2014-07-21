/**
 * Created by ugo on 7/21/14.
 */
// js/services/todos.js
angular.module('ModelService', [])
    // super simple service
    // each function returns a promise object
    .factory('Model', function($http) {
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
            prova : function () {
                var resu;
                return $http.get('/api/id').done( function (res) { resu = res});
                return resu;
            }
        }
    });
