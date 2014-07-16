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

        name: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Gene cannot be blank']
         },
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

PatientSchema.statics.findPatientSNPS = function findPatientSNPS() {
    return this.find({'title':new RegExp(q.title || term, 'i')});
};

module.exports = mongoose.model('Patient', PatientSchema);
