'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    
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
    readsDepth: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'readsDepth cannot be blank']
    },
    ref: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'ref cannot be blank']
    },
    altFilterReads: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'readsDepth cannot be blank']
    },
    genotypeLikelihood: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'genotypeLikelihood cannot be blank']
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
    }

    //Relationship
    /*variant: {
        type: Schema.Type.ObjectId,
        ref: 'Variant'
    },

    sequencing: {
        type: Schema.Type.ObjectId,
        ref: 'Sequencing'
    }*/

});


/**
 * Validations
 */
// nothing for now

/**
 * Virtuals
 */

// no not-persisted attributes
/*
 * Pre-save hook
 */
//still nothing

/**
 * Methods
 */
// no method required here. Query class


mongoose.model('VariantDetail', VariantDetailSchema);
