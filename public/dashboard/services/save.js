/**
 * Created by ugo on 7/21/14.
 */



angular.module('SaveService', [])
    // super simple service
    // each function returns a promise object
    .factory('Save', function ($http, Model, Schema, $q) {

        saveForEachElement = function(element, modelName) {
            var requests = [];
            var arrayAttributes = [];
            for(var i=0;i<element.length; i++) {
                console.log(element[i]);
                for(var j = 0; i < element[i].length; i++)
                {
                    if(element[i][j] instanceof Array){

                        arrayAttributes = element[i][j];
                        delete element[i][j];
                    }
                }

                requests[i] = $http.post('/api/'+modelName,element[i]);
            }
            for(var i=0;i<arrayAttributes.length; i++) {
                requests[requests.length + i] = $http.post('/api/'+modelName+'/'+element._id,element[i]);
            return $q.all(requests);

        };

        function f(element, modelName) {
            var arrayAttributes = [];
            var i = 0;
            for(var i=0;i<element.length; i++) {
                for(var el in element[i]) {
                    if(element.hasOwnProperty(el))
                        if (element[el] instanceof Array){

                            arrayAttributes.push([el,element[el]])
                            delete element[el];
                        };

                        }
                requests[i] = $http.post('/api/'+modelName,element[i]);
                arrayAttributes.forEach( function (item) {
                }
            })
                }
            }
            return {
            saveModel: function (element,data) {
                return $http.post('/api/'+element, data)
            },

            saveParsedData :  function (data) {
            var ok = true;
            var current;
            for (element in data) {

                if(data.hasOwnProperty(element)) {
                    switch (element) {
                        case 'variants':
                            current = 'Variant';
                            break;
                        case 'details':
                            current = 'VariantDetail';
                            break;
                        case 'pathogenicities':
                            current = 'Pathogenicity';
                            break;
                        case 'dbsnps':
                            current = 'DbSNP';
                            break;
                        case 'esps':
                            current = 'Esp';
                            break;
                        case 'genes':
                            current = 'Gene';
                            break;
                        case 'patient':
                            current = 'Patient';
                            break;
                        default:
                            console.log("ERROR: while parsing data. Not recognized object: " + element);
                            break;
                    }

                    var saveResult = saveForEachElement(data[element],current);
                    saveResult.then(function(err) { console.log("response: " + JSON.stringify(err)); ok = false})
                }
            }
            ;
                return ok;
        },

            saveForEachElement : saveForEachElement

        }
        });
