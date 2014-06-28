'use strict'

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    Family = mongoose.model('Family');

var family , family1 , family2;

describe('Create a Family and Save' , function(){
	describe('Model Family' , function(){
		before(function(done) {
			family = new Family({name: 'family@test'});
			family1 = new Family({name: 'family1@test'});
			family2 = new Family({name: 'family2@test'});

		});

		done();
	});

	describe('Save Family' , function(){
		it('should be able to save without problems' , function(done){
			family.save(done);
			family1.save(done);
		});

		it('should fail to save an existing family again', function(done) {
            return family.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without name' , function(done){
        	family2.name = '';
        	return family2.save(function(err){
        		should.exist(err);
        		done();
        	});
        });
	});
});


describe('Remove Family' , function(){
	describe('Model Family' , function(){
		before(function(done) {
			family = new Family({name: 'family@test'});
			family1 = new Family({name: 'family1@test'});
			family2 = new Family({name: 'family2@test'});

			family.save(done);
			family1.save(done);
			family2.save(done);
		});
	});

	describe('Remove specific family' , function(){
		it('should remove family with incorrect name' , function(done){
			return Family.remove({name: 'family222@test'} , function(err){
				should.exist(err);
				done();
			});
		});

		it('should remove family with name' , function(done){
			return Family.remove({name: 'family@test'} , function(err){
				should.not.exist(err);
				done();
			});
		});
	});
});

describe('Remove all Family' , function(){
	describe('Model Family' , function(){
			before(function(done) {
				family = new Family({name: 'family@test'});
				family1 = new Family({name: 'family1@test'});
				family2 = new Family({name: 'family2@test'});

				family.save(done);
				family1.save(done);
				family2.save(done);
			});
	});

	describe('Remove all family' , function(){
		it('should remove all family' , function(done){
			Family.remove({} , function(err){});
			Family.find({} , function(err , familys){
				family.should.have.length(0);
				done();
			});
		});
	});
});






