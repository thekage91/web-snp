'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
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
        type: Schema.ObjectId,
        ref: 'Variant'
    }]
    
});

EspSchema.statics.query = function query(q) {
    return this.find(q);
};


var model = mongoose.model('Esp', EspSchema);
model.attr = {'ESP6500_ALL' : 1,'ESP6500_AA' : 2,'ESP6500_EA' : 3} ;
module.exports = model;