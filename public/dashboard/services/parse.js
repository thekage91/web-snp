/**
 * Created by ugo on 7/21/14.
 */

angular.module('ParseService', [])
    // super simple service
    // each function returns a promise object
    .factory('Parse', function ($http, Model, Schema, $q) {
        return {
            createModelClassesFromData: function (json, patientName) {

                function initializeModelsIDs(args , models) {
                    for (var i = 0; i < arguments.length; i++) {
                    models[i]._id = arguments[i][0];
                }

                }
                var result = {};

                var idNumber = 7;
                result.variants = [];
                result.details = [];
                result.genes = [];
                result.dbsnps = [];
                result.pathogenicities = [];
                result.esps = [];

                (Model.getAllSchemas)().then(
                    function () {
                        schemas = (Schema.inizializeSchemasFromGET)(arguments);

                        for (var key in json) if (json.hasOwnProperty(key))  break;

                        json[key].forEach(function (element) {


                            //build model classes

                            var variant = retrieveFromSchema(element, schemas['Variant']);
                            var detail = retrieveVariantDetail(element, schemas['VariantDetail']);
                            var gene = retrieveFromSchema(element, schemas['Gene']);
                            var dbsnp = retrieveFromSchema(element, schemas['DbSNP']);
                            var pathogenicity = retrievePathogenicity(element, schemas['Pathogenicity']);
                            var esp = retrieveFromSchema(element, schemas['Esp'], true);

                            var models = [variant, detail, gene, dbsnp, pathogenicity, esp];

                            (Model.getANumberOfIDs)(6).then(function () {
                                initializeModelsIDs(arguments,models);
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


                            });
                        });

                        console.log(result);
                    });

            }


        };
    });
