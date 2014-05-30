'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    
/* PAtient schema */
    var PatientSchema = new Schema({
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


mongoose.model('Patient', PatientSchema);
