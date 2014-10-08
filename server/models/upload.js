'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

function validatePresenceOf(x) {
    return true;
}

/* Upload schema */
var UploadSchema = new Schema({

    date: {
        type: Date,
        default: Date.now
    },

    ids: {
     Variant: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    VariantDetail: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    Gene: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    Esp: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    Pathogenicity: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],
    DbSNP: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
]

}  }, { versionKey: false });


UploadSchema.statics.query = function query(q) {
    return this.find(q);
};

var model =  mongoose.model('Upload', UploadSchema);
module.exports = model;


