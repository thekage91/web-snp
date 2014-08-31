/**
 * Created by ugo on 9/1/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/* Filter schema */
var FilterSchema = new Schema({
    filter: {
        type: Schema.Types.Mixed,
        default: []
    }
},{ versionKey: false });

FilterSchema.statics.query = function query(q) {
    return this.find(q);
};


var model = mongoose.model('Filter', FilterSchema);
model.attr = {'Filter':['filter']} ;
module.exports = model;