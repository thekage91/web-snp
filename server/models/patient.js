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

        upload: {

            date: {
                type: Date,
                default: Date.now
            },

            ids: {
                Variant: [
                    {
                        type: Schema.Types.ObjectId,
                        default: [] }
                ],

                VariantDetail: [
                    {
                        type: Schema.Types.ObjectId,
                        default: [] }
                ],

                Gene: [
                    {
                        type: Schema.Types.ObjectId,
                        default: [] }
                ],

                Esp: [
                    {
                        type: Schema.Types.ObjectId,
                        default: [] }
                ],

                Pathogenicity: [
                    {
                        type: Schema.Types.ObjectId,
                        default: [] }
                ],

                Patient: [
                    {
                        type: Schema.Types.ObjectId,
                        default: [] }
                ],

                DbSNP: [
                    {
                        type: Schema.Types.ObjectId,
                        default: [] }
                ]

            }  },
	//Relationship
	variants: [{
		type: Schema.ObjectId,
		ref: 'Variant',
        default: []
	}],

	family: {
		type: Schema.ObjectId,
		ref: 'Family'
	}

} );   //,{ versionKey: false });

PatientSchema.statics.query = function query(q) {
    return this.find(q);
};

var model =  mongoose.model('Patient', PatientSchema);
model.attr = {'Family':['name']};
module.exports = model;

