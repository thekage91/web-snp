'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    
/* Esp schema */
var EspSchema = new Schema({
    ESP6500_ALL: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'ESP6500_ALL cannot be blank']
    },
    ESP6500_AA: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'ESP6500AA cannot be blank']
    },
    ESP6500_EA: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'ESP6500_EA cannot be blank']
    },

    //Relationship
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


mongoose.model('Esp', EspSchema);
