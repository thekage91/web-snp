//Created by ugo on 7/21/14.


angular.module('SaveService', [])
    // super simple service
    // each function returns a promise object
    .factory('Save', function ($http, $rootScope, Model, Schema, $q, $resource) {

        saveForEachElemento = function (element, modelName) {
            var requests = [];
            var arrayAttributes = [];
            for (var i = 0; i < element.length; i++) {
                console.log(element[i]);
                for (var j = 0; i < element[i].length; i++) {
                    if (element[i][j] instanceof Array) {

                        arrayAttributes = element[i][j];
                        delete element[i][j];
                    }
                }

                requests[i] = $http.post('/api/' + modelName, element[i]);
            }
            for (var i = 0; i < arrayAttributes.length; i++) {
                requests[requests.length + i] = $http.post('/api/' + modelName + '/' + element._id, element[i]);
                return $q.all(requests);

            }
            ;
        }

        saveForEachElement = function (allElementsOfAType, modelName) {
            var arrayAttributes = [];
            var requests = [];

            var deferred = $q.defer();
            var temp = {}

            var i = 0;
            for (var i = 0; i < allElementsOfAType.length; i++) {
                var arrayRequests = [];
                var singleElement = allElementsOfAType[i];
                $http.post('/api/' + modelName, singleElement).success(function (data) {
                    var id = data.payload._id;
                    for (var attribute in singleElement) {
                        if (singleElement.hasOwnProperty(attribute)) {
                            if (singleElement[attribute] instanceof Array) {
                                singleElement[attribute].forEach(function (elOfArrayAttribute) {
                                    ;
                                    (temp = {})[attribute] = elOfArrayAttribute;
                                    arrayRequests.push($resource('/api/' + modelName + '/' + id));
                                    if (!(arrayRequests[id] instanceof Array))
                                        arrayRequests[id] = []
                                    arrayRequests[id].push(temp);
                                    delete singleElement[attribute];
                                })
                            }
                        }
                    }

                })


                console.log("Array Request:");
                console.log(arrayRequests);
                console.log("fine");
                requests[i] = $http.post('/api/' + modelName, singleElement).success(function (data) {
                    var newId = data.payload._id;
                    for (var key in arrayRequests) if (arrayRequests.hasOwnProperty(key))  break;
                    arrayRequests[newId] = arrayRequests[key];
                    delete arrayRequests[key];

                    if (arrayRequests[newId])
                        arrayRequests[newId].forEach(function (value, index) {
                            console.log('post /api/' + modelName + '/' + newId + 'Dell oggetto');
                            console.log(value);
                            $http.post('/api/' + modelName + '/' + newId, value).catch(function (err) {
                                console.error('ERROR IN POST /api/' + modelName + '/' + newId + ': ' + JSON.stringify(err))
                            })
                        })
                })
            }

            deferred.resolve(arrayRequests);
            deferred.all(requests).success()
            return $q.all(requests);

            //return $q.all(requests).then(function (x) {return $timeout(function () { $q.all(arrayRequests)},2000)})


        }


        return {
            saveModel: function (element, data) {
                return $http.post('/api/' + element, data)
            },

            saveParsedData: function (data) {
                var ok = true;
                var current;
                for (element in data) {

                    if (data.hasOwnProperty(element)) {
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

                        var saveResult = saveForEachElement(data[element], current);
                        saveResult.then(function (err) {
                            //console.log("response: " + JSON.stringify(err));
                            ok = false
                        })
                    }
                }
                ;
                return ok;
            },

            saveForEachElement: saveForEachElement,

            saveClassFromList: function (singleAttList, schemaName, schemaAttributes) {


                var associatedAttributes = (Schema.retrieveFromSchema)(singleAttList, schemaAttributes);

                return (Model.create)(schemaName, associatedAttributes);/*.then( function(data) {
                    hashNameVariable[schemaName] = data.payload;*/

          /*      var requests = [];
                var dataFromPost = $q.defer();
                var i=0;
                for (var name in hashNameVariable) {
                    if ((hashNameVariable.hasOwnProperty(name) ) && (name !== 'Patient')) {
                        requests[i++] = name;
                        console.log("NAME = " + name);
                        var associatedAttributes = (Schema.retrieveFromSchema)(singleAttributesList, schemas[name]);

                        dataFromPost.promise.then(function (data) {
                            console.log('inserendo in campo '+name+' di hash questo: ')
                            console.log(data);
                            hashNameVariable[name] = data;
                        });

                        (Model.create)(name, associatedAttributes).success(function (data) {
                            dataFromPost.resolve(data.payload);
                        });

                        //requests[i] = (Model.create)(nema,associatedAttributes);
                    }

                }
*/

            }

        }
    })
;
