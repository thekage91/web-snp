'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
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
    },


    // Here start relations
    gene: { 
        type: Schema.Types.ObjectId,
        ref: 'Gene'
    },  
    
    pathogenicity: { 
        type: Schema.Types.ObjectId,
        ref: 'Pathogenicity'
    },
    
    patients: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    
    dbSNPs: [{ 
        type: Schema.Types.ObjectId,
        ref: 'DbSNP'
    }],
    
    esps: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Esp'
    }],

    variantDetails: [{
        type: Schema.Types.ObjectId,
        ref: 'VaiantDetail'
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


module.exports = mongoose.model('Variant', VariantSchema);
