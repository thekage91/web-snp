'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    
/* Sequencing schema */
var SequencingSchema = new Schema({
    //patient id and date are keys
    patientId: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'patient cannot be blank']
    },
    date: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'date cannot be blank']
    },
    patientHealthStatus: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'patientHealthStatus cannot be blank']
    },
    sequencerName: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'sequencerName cannot be blank']
    },
    sequencerModel: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'sequencerModel cannot be blank']
    },
    referenceGenome: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'referenceGenome cannot be blank']
    },
    
    detail :{ 
        qual: {
            type: String,
            required: true,
            validate: [validatePresenceOf, 'qual cannot be blank']
        },
        filter: {
            type: String,
            required: true,
            validate: [validatePresenceOf, 'filter cannot be blank']
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
    },
    //Relatinship
    variants: [{
        type: Schema.Type.ObjectId,
        ref: 'Variant'
    }]
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


mongoose.model('Sequencing', SequencingSchema);
