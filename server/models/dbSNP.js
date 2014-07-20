'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    angoose = require("angoose"),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* DbSNP schema */
var DbSNPSchema = new Schema({
    dbSNP: {
        //key
        type: String,
        required: true,
        unique: true,
        validate: [validatePresenceOf, 'DbSNP cannot be blank']
    },
    freqAlt: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'freqAlt cannot be blank']
    },
    freqRef: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'freqRef cannot be blank']
    },

    //Relationship
    variants: [{
        type: Schema.ObjectId,
        ref: 'Variant'
    }]

});

DbSNPSchema.statics.query = function query(q) {
    return this.find(q);
};

var model = mongoose.model('DbSNP', DbSNPSchema);
model.attr = {'DbSNP':['dbSNP','freqAlt','freqRef']} ;
module.exports = model;
