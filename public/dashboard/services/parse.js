/**
 * Created by ugo on 7/21/14.
 */



angular.module('ParseService', [])
    // super simple service
    // each function returns a promise object
    .factory('Parse', function ($http, Model, Schema, $q) {

        function retrieveVariantDetail(data, variantSchema) {
            var detail = (Schema.retrieveFromSchema)(data, variantSchema);
            detail.altFilteredReads = data['Ref,Alt filtered reads'];
            detail.ref = data['Ref,Alt filtered reads'];
            return detail;
        };

        function retrievePathogenicity(data, pathogenicitySchema) {
            var path = (Schema.retrieveFromSchema)(data, pathogenicitySchema);
            path.GERpp = data['GERP++'];
            path.SIFT = data['SIFT'];
            path.polyPhen = data['PolyPhen-2'];
            return path;
        };



        return {
            saveInDbFromData: function (json, patientName) {

                if(!json) console.log("JSON not passed correctly");
                var returnValue = $q.defer();
                var result = {};

                var idNumber = 6;
                result.variants = [];
                result.details = [];
                result.genes = [];
                result.dbsnps = [];
                result.pathogenicities = [];
                result.esps = [];

                (Model.getAllSchemas)().then(
                    function () {

                        var patient = $q.defer();
                        var schemas = (Schema.inizializeSchemasFromGET)(arguments[0]);
                        console.info("Got schemas " );
                        console.info(schemas);
                        for (var key in json) if (json.hasOwnProperty(key))  break;
                        var patientBeforeID = {name :patientName};

                        $http.post('/api/Patient',patientBeforeID).success(
                            function (res) {
                            console.info(res);
                            patientBeforeID._id = res.payload._id;
                            console.log("Resolving patient");
                            console.log(patientBeforeID)
                            patient.resolve(patientBeforeID)}).error(
                            function (err) {
                                console.error("ERROR while saving patient: " + err);
                                patient.reject(err);
                            });

                        json[key].forEach(function (element) {

                            //build model classes
                            var requests = [];
                            var variant = (Schema.retrieveFromSchema)(element, schemas['Variant']);
                            var detail = retrieveVariantDetail(element, schemas['VariantDetail']);
                            var gene = (Schema.retrieveFromSchema)(element, schemas['Gene']);
                            var dbsnp = (Schema.retrieveFromSchema)(element, schemas['DbSNP']);
                            var pathogenicity = retrievePathogenicity(element, schemas['Pathogenicity']);
                            var esp = (Schema.retrieveFromSchema)(element, schemas['Esp'], true);
                            esp.ESP6500_EA = '.';

                            var models = [variant, detail, gene, dbsnp, pathogenicity, esp];
                            var modelNames = ['Variant', 'VariantDetail', 'Gene', 'DbSNP', 'Pathogenicity', 'Esp'];

                            for(var i=0;i<modelNames.length;i++) {
                                requests[i] = $http.post('/api/'+modelNames[i],models[i]);
                            }
                            var onSuccess = function () {

                                console.log(arguments);
                                for (var i = 0; i < arguments[0].length; i++) {
                                    models[i]._id = arguments[0][i].data.payload._id;
                                }
                                //build model relationships
                                var i = 0;
                                var temp = {};
                                var relationRequest = [];

                                temp = {variantDetails : detail._id};
                                relationRequest[i++] = $http.post('/api/Variant/'+variant._id,temp);

                                temp = {gene : gene._id};
                                relationRequest[i++] = $http.post('/api/Variant/'+variant._id,temp);

                                temp = {dbSNPs : dbsnp._id};
                                relationRequest[i++] = $http.post('/api/Variant/'+variant._id,temp);

                                temp = {pathogenicity : pathogenicity._id};
                                relationRequest[i++] = $http.post('/api/Variant/'+variant._id,temp);

                                temp = {esps : esp._id};
                                relationRequest[i++] = $http.post('/api/Variant/'+variant._id,temp);

                                temp = {patients : patient._id};
                                relationRequest[i++] = $http.post('/api/Variant/'+variant._id,temp);


                                temp = {variant : variant._id};
                                relationRequest[i++] = $http.post('/api/Pathogenicity/'+pathogenicity._id,temp);

                                relationRequest[i++] = $http.post('/api/DbSNP/'+dbsnp._id,temp);

                                relationRequest[i++] = $http.post('/api/Esp/'+esp._id,temp);

                                relationRequest[i++] = $http.post('/api/Gene/'+gene._id,temp);

                                relationRequest[i++] = $http.post('/api/VariantDetail/'+detail._id,temp);

                                $q.all(relationRequest).catch(function(err) {console.error("ERROR while saving relation: " + err)})

                                result.variants.push(variant);
                                result.pathogenicities.push(pathogenicity);
                                result.dbsnps.push(dbsnp);
                                result.esps.push(esp);
                                result.genes.push(gene);
                                result.details.push(detail);
                                result.patient = patient;

                            };

                                var then = function (patientLocal) { patient = patientLocal; $q.all(requests).then(onSuccess, function (err) {
                                    console.error("Error: " + err);
                                    returnValue.reject(err);
                                }); };

                            patient.promise.then(then);
                        });


                        returnValue.resolve(result);
                    } ,function(err) { console.error("Error: "+err); returnValue.reject(err);});

                return returnValue.promise;
            }





        };
    });
