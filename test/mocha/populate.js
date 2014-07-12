/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var should = require('should'),
        mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/mochaTest');
conn.connection.db.dropDatabase();

var DbSNP = mongoose.model('DbSNP');
var Esp = mongoose.model('Esp');
var Family = mongoose.model('Family');
var Gene = mongoose.model('Gene');
var Patient = mongoose.model('Patient');
var Sequencing = mongoose.model('Sequencing');
var VariantDetail = mongoose.model('VariantDetail');
var Pathogenicity = mongoose.model('Pathogenicity');
var Variant = mongoose.model('Variant');


var error = function(err, element) {
    throw new Error("Error while saving " + element);
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
    gene: 'gene@test',
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
    type: 'variant@test',
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

exports.populate = function() {


    gene.save(error);

    esp.save(error);
    dbSNP.save(error);

    family.save(error);
    patient.save(error);

    sequencing.save(error);

    variant.save(error);
    pathogenicity.save(error);


};
