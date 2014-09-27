'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* Variant schema */
var VariantSchema = new Schema({
    chr: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'CHR cannot be blank']
    }, 
    start: {
        type: Number,
        required: true,
        validate: [validatePresenceOf, 'start cannot be blank']
    },
    end: {
        type: Number,
        required: true,
        validate: [validatePresenceOf, 'End cannot be blank']
    },
    ref: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Ref cannot be blank']
    },
    alt: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Alt cannot be blank']
    },


    // Here start relations
    gene: { 
        type: Schema.Types.ObjectId,
        ref: 'Gene'
    },  
    
    pathogenicity: { 
        type: Schema.Types.ObjectId,
        ref: 'Pathogenicity'
    },
    
    patients: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        default: []
    }],
    
    dbSNPs: [{ 
        type: Schema.Types.ObjectId,
        ref: 'DbSNP',
        default: []
    }],
    
    esps: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Esp',
        default: []
    }],

    variantDetails: [{
        type: Schema.Types.ObjectId,
        ref: 'VariantDetail',
        default: []
    }]

},{ versionKey: false });

VariantSchema.statics.query = function query(q) {
    return this.find(q);
};


VariantSchema.statics.rangeQuery = function rangeQuery( q) {
    return this.find({chr: q.chr, start: { $gte: q.start}, end:{ $lte: q.end }});
};


var model = mongoose.model('Variant', VariantSchema);
model.attr = {'Variant' : ['chr' ,'start' ,'end' ,'ref' ,'alt' ]} ;
module.exports = model;
