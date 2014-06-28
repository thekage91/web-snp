'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    Patient = mongoose.model('Patient');

//Globals
var patient, patient1 , patient2;

describe('Create and Save a patient' , function(){
	describe('Model Patient:', function() {
        before(function(done) {
            patient = new Patient({});
            patient1 = new Patient({});
            patient2 = new Patient({});

            done();
    });

    describe('Save patient' , function(){
    	it('should retrieve all patients' , function(done){
    		Patient.find({} , function(err , patients){
    			patients.should.have.length(0);
    			done();
    		});
    	});

    	it('should save patients without error' , function(done){
    		patient.save(function(err){
    			should.not.exist(err);
    		});

    		patient1.save(function(err){
    			should.not.exist(err);
    		});

    		patient2.save(function(err){
    			should.not.exist(err);
    		});
    	});

    	it('should save patients with error' , function(done){
    		patient.save({foo: 'foo'} , function(err){
    			should.exist(err);
    		});

    		patient1.save({foo: 'foo'} , function(err){
    			should.exist(err);
    		});
    		
    		patient2.save({foo: 'foo'} , function(err){
    			should.exist(err);
    		});
    	});

    	it('should save all patients' , function(done){
    		patient.save();
    		patient1.save();
    		patient2.save();

    		Patient.find({} , function(err , patients){
    			patients.should.have.length > 0;
    			done();
    		});
    	});
 	});
});


describe('Remove patients' , function(){
	describe('Model Patient:', function() {
        before(function(done) {
            patient = new Patient({});
            patient1 = new Patient({});
            patient2 = new Patient({});

            patient.save();
            patient1.save();
            patient2.save();

            done();
    });

    describe('Remove patients' , function(){
    	it('should remove all patients' , function(done){
    		Patient.remove({} , function(err){
    		});

    		Patient.find({} , function(err , patients){
    			patients.should.have.length(0);
    			done();
    		});
    	});
    });
});



















