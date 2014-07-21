function camelize(d) {
    return d.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
};

var error = function (err, element) {
    if (err) console.log("Error while saving " + element + ": " + err);
};

function retrieveFromSchema(data, schema, noModify) {
    var res = {};
    var camelized;
    for (var el in data) {
        if (!noModify) camelized = camelize(el); else camelized = el;
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
}

function saveForEachElement(element, model) {
    var temp;
    for (var i = 0; i < element.length; i++) {
        temp = new model(element[i]);
        temp.save(error);
    }
    ;
}

function saveFromParse(data) {

    for (element in data) {

        switch (element) {
            case 'variants':
                saveForEachElement(data[element], Variant);
                break
            case 'details':
                saveForEachElement(data[element], VariantDetail);
                break;
            case 'pathogenicities':
                saveForEachElement(data[element], Pathogenicity);
                break;
            case 'dbsnps':
                saveForEachElement(data[element], DbSNP);
                break;
            case 'esps':
                saveForEachElement(data[element], Esp);
                break;
            case 'genes':
                saveForEachElement(data[element], Gene);
                break;
            case 'patient':
                (new Patient(data[element])).save(error);
                break;
            default:
                console.log("ERROR: while parsing data. Not recognized object: " + element);
                break;
        }
    }
    ;
}


function filterFromAttributes(data, paths) {
    var res = new Array();
    var partial = {};
    if (paths.length == 1) console.log('data =  ' + JSON.stringify(data) + " length = " + data.length);

    //patient non ha un array
    if (!data.length) {
        res = {};
        for (var property in data) {
            console.log("property = " + property);

            if (paths.indexOf(property) !== -1) {
                res[property] = data[property];

            }
        }
    }
    //itero per ogni elemento dell'array
    for (var i = 0; i < data.length; i++) {
        var currentModelElement = data[i];
        partial = {};
        //console.log('elemento corrente: '+JSON.stringify(currentModelElement));

        //itero per ogni attributo     
        for (var property in currentModelElement) {
            if (paths.indexOf(property) !== -1) {
                partial[property] = new Array();
                // console.log('if vero per proprieta: '+property);
                partial[property] = currentModelElement[property];
            }
        }
        res.push(partial);
        //console.log('fuori dal for. res=  '+JSON.stringify(res));
    }
    return res;
}
;

function filterOnlyAttributes(data) {
    var attr = new Array();
    var res = {};
    for (element in data) {
        switch (element) {
            case 'variants':
                attr = ['chr', 'start', 'end', 'ref', 'alt'];

                break
            case 'pathogenicities':
                attr = ['SIFT', 'polyPhen', 'mutationTaster', 'mutationAssessor', 'GERpp', 'phyloP', 'siPhy'];
                break;

            case 'details':
                attr = ['qual', 'filter', 'genotype', 'genotypeQuality', 'readsDeeph', 'ref', 'altFilteredReads',
                    'genotypesLikelihood', 'haplotypeScore', 'strandBias'];

                break;
            case 'dbsnps':
                attr = ['dbSNP', 'freqAlt', 'freqRef'];
                break;
            case 'esps':
                attr = ['ESP6500_ALL', 'ESP6500_AA', 'ESP6500_EA'];
                break;
            case 'genes':
                attr = ['genes', 'region', 'mutation', 'annotation'];
                break;
            case 'patient':
                attr = ['name'];
                break;
            default:
                console.log("ERROR: while parsing data. Not recognized object: " + element);
                break;
        }
        res[element] = filterFromAttributes(data[element], attr);
    }
    return res;


}

console.log("CIAO VENGO CHIAMATO");

