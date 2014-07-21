/**
 * Created by ugo on 7/21/14.
 */

angular.module('ParseService', [])
    // super simple service
    // each function returns a promise object
    .factory('Parse', function($http,Model,$q) {
        return {
            createModelClassesFromData: function (json, schemas, patientName) {

                var result = {};

                var idNumber = 7;
                result.variants = [];
                result.details = [];
                result.genes = [];
                result.dbsnps = [];
                result.pathogenicities = [];
                result.esps = [];

                for (var key in json) if (json.hasOwnProperty(key))  break;
                var patient = {name: patientName};
                json[key].forEach(function (element) {


                    //build model classes

                    var variant = retrieveFromSchema(element, schemas['Variant']);
                    var detail = retrieveVariantDetail(element, schemas['VariantDetail']);
                    var gene = retrieveFromSchema(element, schemas['Gene']);
                    var dbsnp = retrieveFromSchema(element, schemas['DbSNP']);
                    var pathogenicity = retrievePathogenicity(element, schemas['Pathogenicity']);
                    var esp = retrieveFromSchema(element, schemas['Esp'], true);

                    var models = [variant, detail, gene, dbsnp, pathogenicity, esp];

                    var idRequests = [];
                    for (var i = 0; i < idNumber; i++) {
                        idRequest[i] = Model.getAnId;
                    }
                    ;

                    $q.all[idRequest].then(function () {
                        for (var i = 0; i < arguments.length; i++) {

                            console.log("RESTITUiTO DAL POST: " + arguments[i][0]);
                            models[i]._id = arguments[i][0];
                        }
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

                        result.variants.push(variant._id);
                        result.pathogenicities.push(pathogenicity._id);
                        result.dbsnps.push(dbsnp._id);
                        result.esps.push(esp._id);
                        result.genes.push(gene._id);
                        result.details.push(detail._id);


                    });
                });
                console.log(result);
                //return result;
            }


        };
    });







/*







var error = function (err, element) {
    if (err) console.log("Error while saving " + element + ": " + err);
};

function retrieveFromSchema(data, schema, noModify) {
    var res = {};
    var camelized;
    for (var el in data) {
        if (!noModify) camelized = el.camelize(); else camelized = el;
        for (var i=0;i<schema.length;i++)
            if (camelized === schema[i]) {
                res[camelized] = data[el];
                delete data[el];
            }
    }
    console.info("[INFO] Return of retrieve from schema with schema "+JSON.stringify(schema));
    console.info(res);
    return res;
};

function retrieveVariantDetail(data, variantSchema) {
    var detail = retrieveFromSchema(data, variantSchema);
    detail.altFilteredReads = data['Ref,Alt filtered reads'];
    detail.ref = data['Ref,Alt filtered reads'];
    return detail;
}


function retrievePathogenicity(data, pathogenicitySchema) {
    var path = retrieveFromSchema(data, pathogenicitySchema);
    path.GERpp = data['GERP++'];
    path.SIFT = data['SIFT'];
    path.polyPhen = data['PolyPhen-2'];
    return path;
}

function doAsyncGetID() {
    console.info('INFO: AJAX call GET /api/id/');
    return $.get('/api/id/');
}

function doAsyncGetModel(element) {
    console.info('INFO: AJAX call GET /api/model/' + element);
    return $.getJSON('/api/model/' + element);
}

function doAsyncPost(element,data) {
    var path = '/api/'+element+'/';
    console.info('INFO: AJAX call POST '+path);
    console.info('INFO: AJAX call POST data: '); console.info(data);
    return $.post(path,data);
}


function getSchemas() {

    var models = ['Variant', 'VariantDetail', 'Gene', 'DbSNP', 'Pathogenicity', 'Esp', 'Patient'];
    var requests = [];
    $.each(models, function (index, value) {
        var promise = doAsyncGetModel(value);
        requests.push(promise);
    });
    // return a promise that will resolve when all ajax calls are done
    return $.when.apply($, requests);
}

function getIDS(howMuch) {

    var requests = [];
    while(howMuch) {
        var promise = doAsyncGetID();
        requests.push(promise);
        howMuch--;
    };
    // return a promise that will resolve when all ajax calls are done
    return $.when.apply($, requests);
}

function parseFromSchemas(json, schemas, patientName) {


    var result = {};
    result.variants = [];
    result.details = [];
    result.genes = [];
    result.dbsnps = [];
    result.pathogenicities = [];
    result.esps = [];

    for (var key in json) if (json.hasOwnProperty(key))  break;
    var patient = {name: patientName};
    json[key].forEach(function (element) {


        //build model classes

        var variant = retrieveFromSchema(element, schemas['Variant']);
        var detail = retrieveVariantDetail(element, schemas['VariantDetail']);
        var gene = retrieveFromSchema(element, schemas['Gene']);
        var dbsnp = retrieveFromSchema(element, schemas['DbSNP']);
        var pathogenicity = retrievePathogenicity(element, schemas['Pathogenicity']);
        var esp = retrieveFromSchema(element, schemas['Esp'], true);

        var models = [variant,detail,gene,dbsnp,pathogenicity,esp];
        getIDS(6).done( function() {
            for (var i = 0; i < arguments.length; i++) {

                console.log("RESTITUiTO DAL POST: " + arguments[i][0]);
                models[i]._id = arguments[i][0];
            }
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

            result.variants.push(variant._id);
            result.pathogenicities.push(pathogenicity._id);
            result.dbsnps.push(dbsnp._id);
            result.esps.push(esp._id);
            result.genes.push(gene._id);
            result.details.push(detail._id);


        }).fail(function(err) {console.err("ERROR: " + err)})
    });
    // console.log( result);
    return result;
} /*
