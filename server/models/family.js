'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    
    function validatePresenceOf(x) {return true;}
/* Family schema */
var FamilySchema = new Schema({
    
    name: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },

    //Relationship
    patients: [{
    	type: Schema.ObjectId,
    	ref: 'Patient'
    }]

});

FamilySchema.statics.query = function query(q) {
    return this.find(q);
};


var model = mongoose.model('Family', FamilySchema);
model.attr = {'name':  1 } ;
module.exports = model;
