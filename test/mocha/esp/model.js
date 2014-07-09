'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
        mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/mochaTest');
conn.connection.db.dropDatabase();

//var Esp = mongoose.model('Esp');

var Esp = require('../../../server/models/esp');

var esp, esp1;

//Describe the unit test
describe('Creating and saving esp:', function() {

    before(function(done) {
        esp = new Esp({
            ESP6500_ALL: 'esp@test',
            ESP6500_AA: '01020',
            ESP6500_EA: '01040'
        });

        done();
    });
    describe('Save a esp', function() {



        it('should not find element before saving', function(done) {
            Esp.find({ESP6500_ALL: 'esp@test'}, function(err, esps) {
                esps.should.have.length(0);
                done();
            });
        });

        it('should be able to save the element', function(done) {
            esp.save(done);
        });

        it('should only update when saving an existing esp again', function(done) {
            return esp.save(function(err, esp, numAffected) {
                numAffected.should.equal(1);
                done();
            });
        });

        it('should show an error when try to save without ESP6500_ALL', function(done) {
            esp.ESP6500_ALL = '';
            return esp.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without ESP6500_AA', function(done) {
            esp.ESP6500_AA = '';
            return esp.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without ESP6500_EA', function(done) {
            esp.ESP6500_EA = '';
            return esp.save(function(err) {
                should.exist(err);
                done();
            });

        });

    });
    after(function(done) {
        esp.remove();
        done();
    });
});

describe('Finding Esp:', function() {

    before(function(done) {
        esp = new Esp({
            ESP6500_ALL: 'esp@test',
            ESP6500_AA: '01020',
            ESP6500_EA: '01040'
        });

        esp1 = new Esp({
            ESP6500_ALL: 'esp1@test',
            ESP6500_AA: '010220',
            ESP6500_EA: '011040'
        });

        esp.save();
        esp1.save();
        done();
    });

    describe('Retrieving a specific Esp', function() {

        it('should get the element by ESP6500_ALL', function(done) {
            Esp.find({ESP6500_ALL: 'esp@test'}, function(err, esps) {
                esps.should.have.length > 0;
            });
            done();
        });

        it('should get the element by ESP6500_AA', function(done) {
            Esp.find({ESP6500_AA: '01020'}, function(err, esps) {
                esps.should.have.length > 0;
                done();
            });
        });

        it('should get the element by ESP6500_EA', function(done) {
            Esp.find({ESP6500_EA: '011040'}, function(err, esps) {
                esps.should.have.length > 0;
                done();
            });
        });

    });

    after(function(done) {
        esp.remove();
        esp1.remove();
        done();
    });

});

describe('Removing Esp:', function() {
    before(function(done) {
        esp = new Esp({
            ESP6500_ALL: 'esp@test',
            ESP6500_AA: '01020',
            ESP6500_EA: '01040'
        });

        esp1 = new Esp({
            ESP6500_ALL: 'esp1@test',
            ESP6500_AA: '010204',
            ESP6500_EA: '010404'
        });

        esp.save();
        esp1.save();
        done();
    });
    describe('Remove specific Esp', function() {

        it('should remove element by ESP6500_ALL', function(done) {
            Esp.remove({ESP6500_ALL: 'esp@test'}, function(err) {
                should.not.exist(err);
            });
            done();
        });

        it('should remove element by ESP6500_EA', function(done) {
            Esp.remove({ESP6500_AA: '01020'}, function(err) {
                should.not.exist(err);
            });
            done();
        });

        it('should remove element by end', function(done) {
            Esp.remove({ESP6500_EA: '01040'}, function(err) {
                should.not.exist(err);
            });
            done();
        });
    });
    after(function(done) {
        esp.remove();
        esp1.remove();
        done();
    });

});

describe('Modifing Esp:', function() {
    before(function(done) {
        esp = new Esp({
            ESP6500_ALL: 'esp@test',
            ESP6500_AA: '01020',
            ESP6500_EA: '01040'
        });

        esp1 = new Esp({
            ESP6500_ALL: 'esp1@test',
            ESP6500_AA: '010204',
            ESP6500_EA: '010402'
        });

        esp.save();
        esp1.save();
        done();
    });

    describe('Modify specific esp', function() {
        it('should fail when passing null key esp', function(done) {
            Esp.update({ESP6500_ALL: 'esp@test'}, {ESP6500_ALL: ''}, {}, function(err) {
                esp.should.be.ok;
                esp.ESP6500_ALL.should.equal('esp@test');
            });
            done();
        });

        it('should replace esp attribute', function(done) {
            Esp.update({'esp': 'esp@test'},{'esp': 'prova'} , function(err,number) {
                number.should.not.equal(0);
                esp.ESP6500_ALL.should.equal('prova');
            });
            Esp.update({esp: 'prova'}, {esp: 'esp@test'}, {}, function(err,number) {
                number.should.not.equal(0);
                esp.ESP6500_ALL.should.equal('esp@test');
            });
            done();
        });

        it('should replace ESP6500_AA attribute', function(done) {
            Esp.update({esp: 'esp@test'}, {ESP6500_AA: '012'}, {}, function(err,number) {
                number.should.not.equal(0);
                esp.ESP6500_AA.should.equal('012');
            });
            done();
        });

        it('should replace ESP6500_EA attribute', function(done) {
            Esp.update({ESP6500_ALL: 'esp@test'}, {ESP6500_EA: '123'}, {}, function(err,number) {
                number.should.not.equal(0);
                esp.ESP6500_EA.should.equal('123');
            });
            done();
        });

    });
    after(function(done) {
        esp.remove();
        esp1.remove();
        done();
    });

});

conn.connection.db.dropDatabase(function() {
    conn.connection.close(function() {
        done();
    });
});
//TODO: Add relationships test







