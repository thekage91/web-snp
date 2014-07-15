'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* Family schema */
var FamilySchema = new Schema({
    
    name: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },

    //Relationship
    patients: [{
    	type: Schema.ObjectId,
    	ref: 'Patient'
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


module.exports = mongoose.model('Family', FamilySchema);
