/**
 * Created by ugo on 7/21/14.
 */



angular.module('SaveService', [])
    // super simple service
    // each function returns a promise object
    .factory('Save', function ($http, Model, Schema, $q) {

        function initializeModelsIDs(args, models) {
            for (var i = 0; i < models.length; i++) {
                models[i]._id = args[i].data;
            }

        }

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
            createModelClassesFromData: function (json, patientName) {

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

                        var schemas = (Schema.inizializeSchemasFromGET)(arguments[0]);
                        console.info("Got schemas " );
                        console.info(schemas);
                        for (var key in json) if (json.hasOwnProperty(key))  break;

                        json[key].forEach(function (element) {

                            //build model classes

                            var variant = (Schema.retrieveFromSchema)(element, schemas['Variant']);
                            var detail = retrieveVariantDetail(element, schemas['VariantDetail']);
                            var gene = (Schema.retrieveFromSchema)(element, schemas['Gene']);
                            var dbsnp = (Schema.retrieveFromSchema)(element, schemas['DbSNP']);
                            var pathogenicity = retrievePathogenicity(element, schemas['Pathogenicity']);
                            var esp = (Schema.retrieveFromSchema)(element, schemas['Esp'], true);

                            var models = [variant, detail, gene, dbsnp, pathogenicity, esp];
                            var patient = {name :patientName};

                            (Model.getANumberOfIds)(idNumber).then(function () {
                                initializeModelsIDs(arguments[0], models);
                                //build model relationships
                                (variant.variantDetails = []).push(detail._id);
                                variant.gene = gene._id;
                                (variant.dbSNPs = []).push(dbsnp._id);
                                variant.pathogenicity = pathogenicity._id;
                                (variant.esps = []).push(esp._id);
                                (variant.patients = []).push(patient._id);

                                pathogenicity.variant = variant._id;

                                ( dbsnp.variants = []).push(variant._id);

                                ( esp.variants = []).push(variant._id);

                                (gene.variants = []).push(variant._id);

                                detail.variant = variant._id;

                                (patient.variants = []).push(variant._id);

                                result.variants.push(variant);
                                result.pathogenicities.push(pathogenicity);
                                result.dbsnps.push(dbsnp);
                                result.esps.push(esp);
                                result.genes.push(gene);
                                result.details.push(detail);



                            },function(err) { console.err("Error: "+err); returnValue.reject(err);});
                        });
                        result.patient = patients;
                        returnValue.resolve(result);
                    } ,function(err) { console.err("Error: "+err); returnValue.reject(err);});

                return returnValue.promise;
            }





        };
    });
