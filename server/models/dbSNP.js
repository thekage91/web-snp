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
        //unique: true,
        validate: [validatePresenceOf, 'DbSNP cannot be blank']
    },
    freqAlt: {
        type: Number,
        required: true,
        validate: [validatePresenceOf, 'freqAlt cannot be blank']
    },
    freqRef: {
        type: Number,
        required: true,
        validate: [validatePresenceOf, 'freqRef cannot be blank']
    },

    //Relationship
    variants: [{
        type: Schema.ObjectId,
        ref: 'Variant',
        default: []
    }]

},{ versionKey: false });

DbSNPSchema.statics.query = function query(q) {
    return this.find(q);
};

DbSNPSchema.statics.freqRange = function freqRange( gt,lt) {
    return this.find({ "freqAlt": { $gt: gt, $lt: lt }});
};


        var model = mongoose.model('DbSNP', DbSNPSchema);
        model.attr = {'DbSNP':['dbSNP','freqAlt','freqRef']} ;
        module.exports = model;


