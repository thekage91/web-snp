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
    distinctWords: {
        type: Schema.Types.Mixed
    }
},{ versionKey: false });

FilterSchema.statics.query = function query(q) {
    return this.find(q);
};


var model = mongoose.model('Filter', FilterSchema);
model.attr = {'Filter':['distinctWords']} ;
module.exports = model;