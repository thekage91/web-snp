function camelize (d) {
    return d.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  };
  
var error = function(err, element) {
    if(err) console.log("Error while saving " + element + ": " + err);
};

function retrieveFromSchema (data,schema,noModify) {
       var res = {};
       var camelized;
       console.log("SCHEMA = " + JSON.stringify(schema));
       for( var el in data) {
           if(!noModify) camelized = camelize(el); else camelized = el;
           if(schema.indexOf(camelized) > -1) {
               res[camelized] = data[el];
               delete data[el];
           }
       }
       return res;
  };

function retrieveVariantDetail (data,variantSchema) {
        var detail = retrieveFromSchema(data,variantSchema);
        detail.altFilteredReads = data['Ref,Alt filtered reads'];
        detail.ref = data['Ref,Alt filtered reads'];
        return detail;
  } 
  
  
function retrievePathogenicity (data,pathogenicitySchema) {
        var path = retrieveFromSchema(data,pathogenicitySchema);
        path.GERpp = data['GERP++'];
        path.SIFT = data['SIFT'];
        path.polyPhen = data['PolyPhen-2'];
        return path;
  }

function getModelSchema(element) {
    $.get('/api/model/'+element)
        .success(function (data) {
            console.log("Got " + element + " schema\tdata = " + JSON.stringify(data));
            return (JSON.parse('{ \"0\" : ' +data + '}'))['0'];
        }).error(function (data) {
            console.log("[ERROR] Failed getting  "+ element +"  schema");
        });
}


function parse(json) {
    
    
    //Firse element is always some file information
    for (var key in json) {console.log("key = " + key); if (json.hasOwnProperty(key))  break }
    var patientName = 'prova';
    var patient = {name: patientName};
    
    var result = {};
    result.variants = [];
    result.details = [];
    result.genes = [];
    result.dbsnps = [];
    result.pathogenicities = [];
    result.esps = [];

    var Variant = {};
    var VariantDetail= {};
    var Gene= {};
    var DbSNP= {};
    var Pathogenicity = {};
    var Esp = {};
    var Patient = {};

    Variant.schema = getModelSchema('Variant');
    VariantDetail.schema = getModelSchema('VariantDetail');
    Gene.schema = getModelSchema('Gene');
    DbSNP.schema = getModelSchema('DbSNP');
    Pathogenicity.schema = getModelSchema('Pathogenicity');
    Esp.schema = getModelSchema('Esp');
    Patient.schema = getModelSchema('Patient');
    
    console.log('json key = '+ json[key] + "\nkey = " + json[0] + "\njson = " + json.toString().substr(0,100));
    //Iterate on single file elements
    json[key].forEach( function (element) {
        
        //build model classes
        var variant = retrieveFromSchema(element,Variant.schema);
        var detail = retrieveVariantDetail(element,VariantDetail.schema);
        var gene = retrieveFromSchema(element,Gene.schema);
        var dbsnp = retrieveFromSchema(element,DbSNP.schema);
        var pathogenicity = retrievePathogenicity(element,Pathogenicity.schema);
        var esp = retrieveFromSchema(element,Esp.schema,true);
        
        //build model relationships
        variant.variantDetails.push(detail);
        variant.gene = gene;
        variant.dbSNPs.push(dbsnp);
        variant.pathogenicity = pathogenicity;
        variant.esps.push(esp);
        variant.patients.push(patient);
        
        pathogenicity.variant = variant;
        
        dbsnp.variants.push(variant);
        
        esp.variants.push(variant);
        
        gene.variants.push(variant);
        
        detail.variant = variant;
        
        patient.variants.push(variant);
        
        result.variants.push(variant);
        result.pathogenicities.push(pathogenicity);
        result.dbsnps.push(dbsnp);
        result.esps.push(esp);
        result.genes.push(gene);
        result.details.push(detail);
        
        
        //save model classes
       /* esp.save(error);
        pathogenicity.save(error);
        dbsnp.save(error);
        gene.save(error);
        variant.save(error);
        detail.save(error);*/
        
    });
        result.patient = patient;
        return result;
        
  }

function saveForEachElement(element,model) {
        var temp;
        for(var i=0; i < element.length; i++) {
                    temp = new model(element[i]);
                    temp.save(error);
           };
}

function saveFromParse (data) {
    
        for(element in data) {
        
        switch (element) {
            case 'variants':
                saveForEachElement(data[element],Variant);
            break
            case 'details':
                saveForEachElement(data[element],VariantDetail);
            break;
            case 'pathogenicities':
                saveForEachElement(data[element],Pathogenicity);
            break;
            case 'dbsnps':
                saveForEachElement(data[element],DbSNP);
            break;
            case 'esps':
                saveForEachElement(data[element],Esp);
            break;
            case 'genes':
                saveForEachElement(data[element],Gene);
            break;
            case 'patient':
                (new Patient (data[element])).save(error);
            break;
            default:
            console.log("ERROR: while parsing data. Not recognized object: " + element);
            break;
        }
    };
    }
    

function filterFromAttributes(data, paths) {
    var res = new Array();
    var partial = {};
    if(paths.length==1) console.log('data =  '+JSON.stringify(data) + " length = " + data.length);
    
    //patient non ha un array
    if(!data.length)
        {
        res = {};
        for (var property in data) {
            console.log("property = "+ property);
            
            if ( paths.indexOf(property) !== -1) {
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
            if ( paths.indexOf(property) !== -1) {
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
    for(element in data) {
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

