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



var error = function(err, element) {
    if(err) throw new Error("Error while saving " + element + ": " + err);
};

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


function retrieveFromSchema (data,schema) {
       var res = {};
       for( var el in data) {
           if(schema.paths.hasOwnProperty(el)) {
               res[el] = data[el];
               delete data[el];
           }
       }
       return res;
  };
/*
function retrieveVariantDetail (data) {
        var detail = retrieveFromSchema(data,VariantDetailSchema);
        detail.
  } */
    
function parse(json) {
    //console.log("Questi sono i dati: " + JSON.stringify(json));
    for (var key in json) if (json.hasOwnProperty(key))  break;
   
    json[key].forEach( function (element) {
        var variant = new Variant(retrieveFromSchema(element,Variant.schema));
        variant.save(function (err) { if(err) console.log("ERRORE: "+ err) } );
        console.log("HO SALVATO: "+ variant);
    });
  }
  
  parse(json);

