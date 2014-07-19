'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* Pathogenicity schema */
var PathogenicitySchema = new Schema({
    SIFT: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'SIFT cannot be blank']
    },
    
    polyPhen: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'polyPhen cannot be blank']
    },
    
    mutationTaster: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'mutationTaster cannot be blank']
    },
    
    mutationAssessor: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'mutationAssessor cannot be blank']
    },
    
    GERpp: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'GERPpp cannot be blank']
    },
    
    phyloP: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'pyoloP cannot be blank']
    },
    
    siPhy: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'siPhy cannot be blank']
    },

    //Relationship
    variant: {
        type: Schema.ObjectId,
        ref: 'Variant'
    } 
    
});

PathogenicitySchema.statics.query = function query(q) {
    return this.find(q);
};

var model =  mongoose.model('Pathogenicity', PathogenicitySchema);
model.attr = ['SIFT','polyPhen','mutationTaster','mutationAssessor','GERpp','phyloP','siPhy'] ;
module.exports = model;
