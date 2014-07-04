'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose');
    
//    var DbSNP = mongoose.model('DbSNP');
    
var DbSNP = require('../../../server/models/dbSNP');
//Globals
var dbSNP;

//Describe the unit test
describe('Create a DbSNP and Save', function() {
        describe('Model dbSNP:', function() {
            before(function(done) {
                dbSNP = new DbSNP({
                    dbSNP: 'dbSNP@test',
                    freqAlt: '01020',
                    freqRef: '01040'
                });

                done();
        });

        describe('Save a dbSNP', function() {
            it('should begin without the test dbSNP', function(done) {
                DbSNP.find({ type: 'dbSNP@test' }, function(err, dbSNPs) {
                    dbSNPs.should.have.length(0);
                    done();
                });
            });

            it('should be able to save without problems', function(done) {
                dbSNP.save(done);
            });

            it('should fail to save an existing dbSNP again', function(done) {
                return dbSNP.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when try to save without dbSNP', function(done) {
                dbSNP.dbSNP = '';
                return dbSNP.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when try to save without freqAlt', function(done) {
                dbSNP.freqAlt = '';
                return dbSNP.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when try to save without freqRef', function(done) {
                dbSNP.freqRef = '';
                return dbSNP.save(function(err) {
                    should.exist(err);
                    done();
        });

        after(function(done) {
            dbSNP.remove();
            done();
        });
    });
});
        }); 
    });


describe('Search DbSNP' , function(){
    describe('Model DbSNP:', function() {
        before(function(done) {
            dbSNP = new DbSNP({
                dbSNP: 'dbSNP@test',
                freqAlt: '01020',
                freqRef: '01040'
            });

            dbSNP1 = new DbSNP({
                dbSNP: 'dbSNP1@test',
                freqAlt: '010220',
                freqRef: '011040'
            });

            dbSNP.save(done);
            dbSNP1.save(done);
            done();
    });

    describe('Search a specific DbSNP' , function(){
        it('should search dbSNP with specific dbSNP' , function(done){
            DbSNP.find({ type: 'dbSNP@test' }, function(err, dbSNPs) {
                    dbSNPs.should.have.length > 0;
                    done();
                });
        });

        it('should search dbSNP with specific freqAlt' , function(done){
            DbSNP.find({ start: '01020' }, function(err, dbSNPs) {
                    dbSNPs.should.have.length > 0;
                    done();
                });
        });

        it('should search dbSNP with specific freqRef' , function(done){
            DbSNP.find({ end: '011040' }, function(err, dbSNPs) {
                    dbSNPs.should.have.length > 0;
                    done();
                });
        });

    });

    after(function(done) {
        dbSNP.remove();
        dbSNP1.remove();
        done();
    });
});
        });

describe('Remove DbSNP' , function(){
    describe('Model DbSNP:', function() {
        before(function(done) {
            dbSNP = new DbSNP({
               dbSNP: 'dbSNP@test',
                freqAlt: '01020',
                freqRef: '01040'
            });

            dbSNP1 = new DbSNP({
               dbSNP: 'dbSNP1@test',
                freqAlt: '010204',
                freqRef: '010404'
            });

            dbSNP.save(done);
            dbSNP1.save(done);
            done();
    });

    describe('Remove specific DbSNP' , function(){
        it('should fail to remove dbSNP with specific dbSNP' , function(done){
            DbSNP.remove({dbSNP: 'dbSNP222@test'} , function(err){
                dbSNP.should.exist(err);
            })
        });

        it('should remove dbSNP with specific dbSNP' , function(done){
            DbSNP.remove({dbSNP: 'dbSNP@test'} , function(err){
                dbSNP.should.not.exist(err);
            })
        });

        it('should remove dbSNP with specific freqRef' , function(done){
            DbSNP.remove({freqAlt: '01020'} , function(err){
                dbSNP.should.not.exist(err);
            })
        });

        it('should remove dbSNP with specific end' , function(done){
            DbSNP.remove({freqRef: '01040'} , function(err){
                dbSNP.should.not.exist(err);
            })
        });
    });
});
});

describe('Modified DbSNP' , function(){
    describe('Model DbSNP:', function() {
            before(function(done) {
                dbSNP = new DbSNP({
                    dbSNP: 'dbSNP@test',
                    freqAlt: '01020',
                    freqRef: '01040'
                });

                dbSNP1 = new DbSNP({
                    dbSNP: 'dbSNP1@test',
                    freqAlt: '010204',
                    freqRef: '010402'
                });

                dbSNP.save(done);
                dbSNP1.save(done);
                done();
    });

    describe('Modified specific dbSNP' , function(){
        it('should fail to modified dbSNP with null dbSNP' , function(done){
            
            DbSNP.update( { dbSNP: 'dbSNP@test' },{ dbSNP: ''},{}, function(err){
                dbSNP.dbSNP.shold.equal('dbSNP@test');
            } );
        });
        
        it('should modified dbSNP attribute with specific dbSNP' , function(done){
            DbSNP.update( { dbSNP: 'dbSNP@test' },{ dbSNP: 'prova'},{}, function(err){
                dbSNP.dbSNP.shold.equal('prova');
            } );
        } );
        
         it('should modified dbSNP attribute with specific freqAlt' , function(done){
            DbSNP.update( { dbSNP: 'dbSNP@test' },{ freqAlt: '012'},{}, function(err){
                dbSNP.freqAlt.shold.equal('012');
            } );
        } );
        
         it('should modified dbSNP attribute with specific freqRef' , function(done){
            DbSNP.update( { dbSNP: 'dbSNP@test' },{ freqRef: '123'},{}, function(err){
                dbSNP.freqRef.shold.equal('123');
            } );
        } );
            
        });

    });
});


//TODO: Add relationships test







