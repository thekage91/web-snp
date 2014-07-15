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
    
    GERPpp: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'GERPpp cannot be blank']
    },
    
    pyoloP: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'pyoloP cannot be blank']
    },
    
    SiPhy: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'SiPhy cannot be blank']
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

module.exports = mongoose.model('Pathogenicity', PathogenicitySchema);
