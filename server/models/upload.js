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
    patientName: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },
    date: {
        type: Date,
        default: Date.now
    },

    ids: {
     variants: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    variantdetails: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    genes: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    esps: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    pathogenicities: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    patients: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
],

    dbsnps: [
    {
        type: Schema.Types.ObjectId,
        default: [] }
]

}  }, { versionKey: false });


UploadSchema.statics.query = function query(q) {
    return this.find(q);
};


var model = mongoose.model('Upload', UploadSchema);
model.attr = {'Upload': ['name', 'date', 'ids']};
module.exports = model;
