/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var should = require('should'),
    mongoose = require('mongoose');
    
//conn.connection.db.dropDatabase();

var request = require('supertest');
var app = require('../../server');
var agent = request.agent(app);

var DbSNP = require('../../server/models/dbSNP');
var Esp = require('../../server/models/esp');
var Family = require('../../server/models/family');
var Gene = require('../../server/models/gene');
var Patient = require('../../server/models/patient');
var Sequencing = require('../../server/models/sequencing');
var VariantDetail = require('../../server/models/variantDetail');
var Pathogenicity = require('../../server/models/pathogenicity');
var Variant = require('../../server/models/variant');

var json = require('./JSON.json');





var esp = new Esp({
    ESP6500_ALL: 'esp@test',
    ESP6500_AA: '01020',
    ESP6500_EA: '01040'
});

var dbSNP = new DbSNP({
    dbSNP: 'dbSNP@test',
    freqAlt: '01020',
    freqRef: '01040'
});

var family = new Family({name: 'family@test'});


var gene = new Gene({
    gene: 'gene1',
    region: '01020',
    mutation: '01040',
    annotation: 'annot'
});

var patient = new Patient({});

var sequencing = new Sequencing({
    patientId: '3XX33W',
    date: '03/12/14',
    patientHealthStatus: 'good',
    sequencerName: 'testTest',
    sequencerModel: 'sequencerTest',
    referenceGenome: 'testGenomeReference'
});



var variantDetail = new VariantDetail({
    qual: 'variant@test',
    filter: '01020',
    genotype: '01040',
    genotypeQuality: 'X3D3R',
    readsDepth: 'XXCC',
    ref: 'testref',
    altFilteredReads: 'testaltFilteredReads',
    genotypesLikelihood: 'testgenotypesLikelihood',
    haplotypeScore: 'testhaplotypeScore',
    strandBias: 'teststrandBias'
});
var variant = new Variant({
    chr: 'variant@test',
    start: '01020',
    end: '01040',
    ref: 'X3D3R',
    alt: 'XXCC'
});



var pathogenicity = new Pathogenicity({
    SIFT: 'testSIFT',
    polyPhen: 'testpolyPhen',
    mutationTaster: 'testmutationTaster',
    mutationAssessor: 'testmutationAssessor',
    GERPpp: 'testGERPpp',
    pyoloP: 'testpyoloP',
    SiPhy: 'testSiPhy'
});

 
module.exports.populate = function() {

    gene.variants.push(variant._id);
    dbSNP.variants.push(variant._id);
    esp.variants.push(variant._id);
    family.patients.push(patient._id);
    pathogenicity.variant = variant._id;
    patient.variants.push(variant._id);
    patient.family = family._id;
    sequencing.variant = variant._id;
    variantDetail.variant = variant._id;
            
    variant.gene = gene._id;
    variant.pathogenicity = pathogenicity._id;
    variant.patients.push(patient._id);
    variant.dbSNPs.push(dbSNP._id);
    variant.esps.push(esp._id);
    variant.variantDetails.push(variantDetail._id);
    
    gene.save(error);
   
    
    dbSNP.save(error);
    esp.save(error);
    family.save(error);
    patient.save(error);
    variantDetail.save(error);
    sequencing.save(error);
    variant.save(error);
    pathogenicity.save(error);
    
    /*app.post('/api/esp');
    agent.post('/api/esp').send(esp).end(function(res){
     if (res.ok) {
       console.log('yay got ' + JSON.stringify(res.body));
     } else {
       console.log('Oh no! error ' + res.text);
     }
     
 console.log("QUA ARRIVA1");
   });
   
//module.exports = populate;
   /*
    dbSNP.save(error);

    family.save(error);
    patient.save(error);

    sequencing.save(error);

    variant.save(error);
    pathogenicity.save(error);*/


};



//DA QUI INIZIANO LE FUNZIONI PER IL PARSING. LA FUNZIONE È PARSE();
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
       for( var el in data) {
           if(!noModify) camelized = camelize(el); else camelized = el;
           if(schema.paths.hasOwnProperty(camelized)) {
               res[camelized] = data[el];
               delete data[el];
           }
       }
       return res;
  };

function retrieveVariantDetail (data) {
        var detail = retrieveFromSchema(data,VariantDetail.schema);
        detail.altFilteredReads = data['Ref,Alt filtered reads'];
        detail.ref = data['Ref,Alt filtered reads'];
        return detail;
  } 
  
  
function retrievePathogenicity (data) {
        var path = retrieveFromSchema(data,Pathogenicity.schema);
        path.GERpp = data['GERP++'];
        path.SIFT = data['SIFT'];
        path.polyPhen = data['PolyPhen-2'];
        return path;
  } 
    
function parse(json) {
    
    
    //Firse element is always some file information
    for (var key in json) if (json.hasOwnProperty(key))  break;
    var patientName = /[^_]*/.exec(key)[0];
    var patient = new Patient({name: patientName});
    
    var result = {};
    result.variants = new Array();
    result.details = new Array();
    result.genes = new Array();
    result.dbsnps = new Array();
    result.pathogenicities = new Array();
    result.esps = new Array();
    
    //Iterate on single file elements
    json[key].forEach( function (element) {
        
        //build model classes
        var variant = new Variant(retrieveFromSchema(element,Variant.schema));
        var detail = new VariantDetail(retrieveVariantDetail(element));
        var gene = new Gene(retrieveFromSchema(element,Gene.schema));
        var dbsnp = new DbSNP(retrieveFromSchema(element,DbSNP.schema));
        var pathogenicity = new Pathogenicity(retrievePathogenicity(element));
        var esp = new Esp(retrieveFromSchema(element,Esp.schema,true));
        
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

saveFromParse(parse(json));
