'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* Gene schema */
var GeneSchema = new Schema({
    genes: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Gene cannot be blank']
    },
    region: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Region cannot be blank']
    },
    mutation: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Mutation cannot be blank']
    },
    annotation: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Annotation cannot be blank']
    },

    // Relationship
    variants: [{
        type: Schema.ObjectId,
        ref: 'Variant'
    }]

});

GeneSchema.statics.query = function query(q) {
    return this.find(q);
};

module.exports = mongoose.model('Gene', GeneSchema);
