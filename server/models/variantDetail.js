'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* VariantDetail schema */
var VariantDetailSchema = new Schema({
    //foreignKey
    qual: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'qual cannot be blank']
    },
    genotype: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'genotype cannot be blank']
    },
    genotypeQuality: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'genotypeQuality cannot be blank']
    },
    readsDeeph: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'readsDepth cannot be blank']
    },
    ref: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'ref cannot be blank']
    },
    altFilteredReads: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'altFilteredReads cannot be blank']
    },
    genotypesLikelihood: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'genotypesLikelihood cannot be blank']
    },
    haplotypeScore: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'haplotypeScore cannot be blank']
    },
    strandBias: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'strandBias cannot be blank']
    },

    //Relationship
    variant: {
        type: Schema.ObjectId,
        ref: 'Variant'
    }
/*
    sequencing: {
        type: Schema.ObjectId,
        ref: 'Sequencing'
    }*/

});


VariantDetailSchema.statics.query = function query(q) {
    return this.find(q);
};

var model = mongoose.model('VariantDetail', VariantDetailSchema);
model.attr = {'VariantDetail': ['qual' ,'genotype' ,'genotypeQuality' ,'readsDeeph' ,'ref' ,'altFilteredReads' ,'genotypesLikelihood' ,'haplotypeScore' ,'strandBias' ]} ;
module.exports = model;
