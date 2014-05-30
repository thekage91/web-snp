'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    
/* Variant schema */
    var VariantSchema = new Schema({
    chr: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'CHR cannot be blank']
    },
    start: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'start cannot be blank']
    },
    end: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'End cannot be blank']
    },
    ref: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Ref cannot be blank']
    },
    alt: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Alt cannot be blank']
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


mongoose.model('Variant', VariantSchema);
