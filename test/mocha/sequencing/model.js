'use strict';

/**
 * Module dependencies.
 */
 var should = require('should'),
 mongoose = require('mongoose'),
 Sequencing = mongoose.model('Sequencing');


 var sequencing , sequencing1 , sequencing2;

 describe('Create a sequencing and Save' , function(){
 	describe('Model Sequencing' , function(){
 		before(function(done){
 			sequencing = new Sequencing({
 				patientId: '3XX33W';
 				date: '03/12/14';
 				patientHealthStatus: 'good';
 				sequencerName: 'testTest';
 				sequencerModel: 'sequencerTest';
 				referenceGenome: 'testGenomeReference';
 			});

 			done();
 		});
 	});

 	describe('Save a sequencing' , function(){
 		it('should begin without the test sequencing', function(done) {
 			Sequencing.find({ patientId: '3XX33W' }, function(err, sequencings) {
 				sequencings.should.have.length(0);
 				done();
 			});
 		});

 		it('should be able to save without problems', function(done) {
 			sequencing.save(done);
 		});

 		it('should fail to save an existing variant again', function(done) {
 			return sequencing1.save(function(err) {
 				should.exist(err);
 				done();
 			});
 		});
 	});
 });