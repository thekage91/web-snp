'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    
/* Patient schema */
var PatientSchema = new Schema({

	//Relationship
	variants: [{
		type: Schema.Type.ObjectId,
		ref: 'Variant'
	}],

	family: {
		type: Schema.Type.ObjectId,
		ref: 'Family'
	}

});



mongoose.model('Patient', PatientSchema);
