'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* DbSNP schema */
    var DbSNPSchema = new Schema({
    dbSNP: {
        //key
        type: String,
        required: true,
        unique: true,
        validate: [validatePresenceOf, 'DbSNP cannot be blank']
    },
    freqAlt: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'freqAlt cannot be blank']
    },
    freqRef: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'freqRef cannot be blank']
    },

    //Relationship
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


mongoose.model('DbSNP', DbSNPSchema);
