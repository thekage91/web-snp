'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    
/* Sequencing schema */
    var SequencingSchema = new Schema({
        //patient id date are keys
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
    }
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
