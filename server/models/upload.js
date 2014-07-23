'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    angoose = require("angoose"),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* Upload schema */
var UploadSchema = new Schema({
    name: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },
    date: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Date cannot be blank']
    },

    //Relationship
    ids: [{
        type: Schema.ObjectId,
    }]

},{ versionKey: false });

UploadSchema.statics.query = function query(q) {
    return this.find(q);
};

var model = mongoose.model('Upload', UploadSchema);
model.attr = {'Upload':['name','date']} ;
module.exports = model;
