/**
 * Created by ugo on 7/21/14.
 */



angular.module('ParseService', [])
    // super simple service
    // each function returns a promise object
    .factory('Parse', function ($http, Model, Schema, $q,$timeout) {

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
                var jsonWithIdToSave =  $q.defer();
                var resultIDs = {};

                var classes= ['variants','variantdetails','esps','genes','pathogenicities','dbsnps','patients'];
                resultIDs.name = patientName;
                resultIDs.ids = [];
                for(var i=0;i<classes.length;i++)
                {
                    resultIDs.ids[classes[i]]= [];
                }




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

                            //TO REMOVE WHEN SOLVED INVALID PARSING
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


                                temp = {variants : variant._id};
                                relationRequest[i++] = $http.post('/api/Esp/'+esp._id,temp);
                                relationRequest[i++] = $http.post('/api/DbSNP/'+dbsnp._id,temp);
                                relationRequest[i++] = $http.post('/api/Gene/'+gene._id,temp);

                                $http.get('/api/Patient/'+patient._id).success(function (data) {
                                    console.log("Got: ",data.payload.variants);
                                    console.log("Data che posterei: ",data.payload.variants.concat(variant._id));
                                    $http({
                                        method: 'POST',
                                        url: '/api/Patient/'+patient._id,
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                        transformRequest: function(obj) {
                                            var str = [];
                                            for(var p in obj) if(obj.hasOwnProperty(p))
                                                str.push(encodeURIComponent('variants') + "=" + encodeURIComponent(obj[p]));
                                            console.log("La richiesta è così formulata: " + str.join("&"));
                                            return str.join("&");
                                        },
                                        data: data.payload.variants.concat(variant._id)
                                    }).success(function () {console.log("ALLZ OK")}).error(function(err) {
                                        console.error("ERROR: " + JSON.stringify(err))
                                    });
                                })

                                relationRequest[i++] = $http.post('/api/Patient/'+patient._id,temp);

                                temp = {variant : variant._id};
                                relationRequest[i++] = $http.post('/api/Pathogenicity/'+pathogenicity._id,temp);
                                relationRequest[i++] = $http.post('/api/VariantDetail/'+detail._id,temp);

                                $q.all(relationRequest).then(
                                    function(doneData) {



                                    },function(err) {console.error("ERROR while saving relation: " + err)})

                                resultIDs.ids.variants.push(variant._id);
                                resultIDs.ids.pathogenicities.push(pathogenicity._id);
                                resultIDs.ids.dbsnps.push(dbsnp._id);
                                resultIDs.ids.esps.push(esp._id);
                                resultIDs.ids.genes.push(gene._id);
                                resultIDs.ids.variantdetails.push(detail._id);
                                resultIDs.ids.patient = patient;

                            };

                            var then = function (patientLocal) { patient = patientLocal; $q.all(requests).then(onSuccess, function (err) {
                                    console.error("Error: " + err);
                                    returnValue.reject(err);
                                }); };

                            patient.promise.then(then);
                        });


                        jsonWithIdToSave.resolve(resultIDs);
                    } ,function(err) { console.error("Error: "+err); jsonWithIdToSave.reject(err);});

                jsonWithIdToSave.promise.then(
                    function (data) {
                     $timeout(function() {
                          console.log("Now posting Upload ID");
                          console.log(data);
                          $http.post('api/upload',data).success(function() {  console.log("Post of upload went ok")} )
                          },3000);

                    },
                    function(err) {
                        console.error("Error: "+err); returnValue.reject(err);
                    });
                ;
            }





        };
    });
