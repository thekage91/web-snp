'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    angoose = require("angoose"),
    Schema = mongoose.Schema,
    crypto = require('crypto');

function validatePresenceOf(x) {
    return true;
}

var idSchema = new Schema({
    variants: [
        {
            type: Schema.Types.ObjectId,
            required: true }
    ],

    variantdetails: [
        {
            type: Schema.Types.ObjectId,
            required: true }
    ],

    genes: [
        {
            type: Schema.Types.ObjectId,
            required: true }
    ],

    esps: [
        {
            type: Schema.Types.ObjectId,
            required: true }
    ],

    pathogenicities: [
        {
            type: Schema.Types.ObjectId,
            required: true }
    ],

    patients: [
        {
            type: Schema.Types.ObjectId,
            required: true }
    ],

    dbsnps: [
        {
            type: Schema.Types.ObjectId,
            required: true }
    ] })

/* Upload schema */
var UploadSchema = new Schema({
    name: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },
    date: {
        type: Date,
        default: Date.now
    },

    ids: [idSchema]

}, { versionKey: false });


UploadSchema.statics.query = function query(q) {
    return this.find(q);
};


var model = mongoose.model('Upload', UploadSchema);
model.attr = {'Upload': ['name', 'date', 'ids']};
module.exports = model;
