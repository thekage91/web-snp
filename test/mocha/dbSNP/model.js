'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
        mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/mochaTest');
conn.connection.db.dropDatabase();

//var DbSNP = mongoose.model('DbSNP');

var DbSNP = require('../../../server/models/dbSNP');

var dbSNP, dbSNP1;

//Describe the unit test
describe('Creating and saving dbSNP:', function() {

    before(function(done) {
        dbSNP = new DbSNP({
            dbSNP: 'dbSNP@test',
            freqAlt: '01020',
            freqRef: '01040'
        });

        done();
    });
    describe('Save a dbSNP', function() {



        it('should not find element before saving', function(done) {
            DbSNP.find({type: 'dbSNP@test'}, function(err, dbSNPs) {
                dbSNPs.should.have.length(0);
                done();
            });
        });

        it('should be able to save the element', function(done) {
            dbSNP.save(done);
        });

        it('should only update when saving an existing dbSNP again', function(done) {
            return dbSNP.save(function(err, dbsnp, numAffected) {
                numAffected.should.equal(1);
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

        });

    });
    after(function(done) {
        dbSNP.remove();
        done();
    });
});

describe('Finding DbSNP:', function() {

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

        dbSNP.save();
        dbSNP1.save();
        done();
    });

    describe('Retrieving a specific DbSNP', function() {

        it('should get the element by key', function(done) {
            DbSNP.find({dbSNP: 'dbSNP@test'}, function(err, dbSNPs) {
                dbSNPs.should.have.length > 0;
            });
            done();
        });

        it('should get the element by freqAlt', function(done) {
            DbSNP.find({freqAlt: '01020'}, function(err, dbSNPs) {
                dbSNPs.should.have.length > 0;
                done();
            });
        });

        it('should get the element by freqRef', function(done) {
            DbSNP.find({freqRef: '011040'}, function(err, dbSNPs) {
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

describe('Removing DbSNP:', function() {
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

        dbSNP.save();
        dbSNP1.save();
        done();
    });
    describe('Remove specific DbSNP', function() {

        it('should remove element by key dbSNP', function(done) {
            DbSNP.remove({dbSNP: 'dbSNP@test'}, function(err) {
                should.not.exist(err);
            });
            done();
        });

        it('should remove element by freqRef', function(done) {
            DbSNP.remove({freqAlt: '01020'}, function(err) {
                should.not.exist(err);
            });
            done();
        });

        it('should remove element by end', function(done) {
            DbSNP.remove({freqRef: '01040'}, function(err) {
                should.not.exist(err);
            });
            done();
        });
    });
    after(function(done) {
        dbSNP.remove();
        dbSNP1.remove();
        done();
    });

});

describe('Modifing DbSNP:', function() {
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

        dbSNP.save();
        dbSNP1.save();
        done();
    });

    describe('Modify specific dbSNP', function() {
        it('should fail when passing null key dbSNP', function(done) {
            DbSNP.update({dbSNP: 'dbSNP@test'}, {dbSNP: ''}, {}, function(err) {
                dbSNP.should.be.ok;
                dbSNP.dbSNP.should.equal('dbSNP@test');
            });
            done();
        });

        it('should replace dbSNP attribute', function(done) {
            DbSNP.update({'dbSNP': 'dbSNP@test'},{'dbSNP': 'prova'} , function(err,number) {
                number.should.not.equal(0);
                dbSNP.dbSNP.should.equal('prova');
            });
            DbSNP.update({dbSNP: 'prova'}, {dbSNP: 'dbSNP@test'}, {}, function(err,number) {
                number.should.not.equal(0);
                dbSNP.dbSNP.should.equal('dbSNP@test');
            });
            done();
        });

        it('should replace freqAlt attribute', function(done) {
            DbSNP.update({dbSNP: 'dbSNP@test'}, {freqAlt: '012'}, {}, function(err,number) {
                number.should.not.equal(0);
                dbSNP.freqAlt.should.equal('012');
            });
            done();
        });

        it('should replace freqRef attribute', function(done) {
            DbSNP.update({dbSNP: 'dbSNP@test'}, {freqRef: '123'}, {}, function(err,number) {
                number.should.not.equal(0);
                dbSNP.freqRef.should.equal('123');
            });
            done();
        });

    });
    after(function(done) {
        dbSNP.remove();
        dbSNP1.remove();
        done();
    });

});

conn.connection.db.dropDatabase(function() {
    conn.connection.close(function() {
        done();
    });
});
//TODO: Add relationships test







