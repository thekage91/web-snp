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
        validate: [validatePresenceOf, 'Name cannot be blank']
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

} );   //,{ versionKey: false });

PatientSchema.statics.findPatientSNPS = function findPatientSNPS() {
    return this.find({'title':new RegExp(q.title || term, 'i')});
};

var model =  mongoose.model('Patient', PatientSchema);
model.attr = {'Family':['name']};
module.exports = model;

