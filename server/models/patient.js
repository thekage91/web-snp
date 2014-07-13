'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* PAtient schema */
var PatientSchema = new Schema({

	//Relationship
	variants: [{
		type: Schema.ObjectId,
		ref: 'Variant'
	}],

	family: {
		type: Schema.ObjectId,
		ref: 'Family'
	}

});



module.exports = mongoose.model('Patient', PatientSchema);
