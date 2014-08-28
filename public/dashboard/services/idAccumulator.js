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

            accumulateIDfromAll : function(elements,patient) {
                var collection;
                var accumulateRequests = [];
                var currentData;

                for (el in elements) if(elements.hasOwnProperty(el))  {
                        currentData = elements[el];
                        switch (el) {
                            case 'Variant':
                                collection = 'variants';
                                break;
                            case 'VariantDetail':
                                collection = 'variantdetails';
                                break;
                            case 'Pathogenicity':
                                collection = 'pathogenicities';
                                break;
                            case 'DbSNP':
                                collection = 'dbsnps';
                                break;
                            case 'Esp':
                                collection = 'esps';
                                break;
                            case 'Gene':
                                collection = 'genes';
                                break;
                            default:
                                console.log("ERROR: while parsing data. Not recognized object: " + el);
                                return;
                                break;
                        //accumulateRequests.push(accumulate(patient,collection,el._id)());

                        }
                    console.log("accumulating for collection: " + collection + " id: " + currentData._id);
                    accumulateRequests.push($http.post('api/idAcc/'+patient.name,{ modelClass : collection, id : currentData._id}))

                }

                return $q.all(accumulateRequests);
            } ,
            accumulate: accumulate
        }
    });
