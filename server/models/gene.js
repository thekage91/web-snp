'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* Gene schema */
var GeneSchema = new Schema({
    gene: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Gene cannot be blank']
    },
    region: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Region cannot be blank']
    },
    mutation: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Mutation cannot be blank']
    },
    annotation: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Annotation cannot be blank']
    },

    // Relationship
    variants: [{
        type: Schema.ObjectId,
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


module.exports = mongoose.model('Gene', GeneSchema);
