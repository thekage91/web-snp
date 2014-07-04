'use strict';

/**
 * Module dependencies.
 */
 var should = require('should'),
 mongoose = require('mongoose'),
 Variant = mongoose.model('Variant');

//Globals
var variant, variant1 , variant2;

//Describe the unit test
describe('Create a Variant and Save', function() {
    describe('Model Variant:', function() {
        before(function(done) {
            variant = new Variant({
                type: 'variant@test',
                start: '01020',
                end: '01040',
                ref: 'X3D3R',
                alt: 'XXCC'
            });
            done();
        });
    });

    describe('Save a variant', function() {
        it('should begin without the test variant', function(done) {
            Variant.find({ type: 'variant@test' }, function(err, variants) {
                variants.should.have.length(0);
                done();
            });
        });

        it('should be able to save without problems', function(done) {
            variant.save(done);
        });

        it('should fail to save an existing variant again', function(done) {
            return variant.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without type', function(done) {
            variant.type = '';
            return variant.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without start', function(done) {
            variant.start = '';
            return variant.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without end', function(done) {
            variant.end = '';
            return variant.save(function(err) {
                should.exist(err);
                done();
            });

            it('should show an error when try to save without ref', function(done) {
                variant.ref = '';
                return variant.save(function(err) {
                    should.exist(err);
                    done();
                });

                it('should show an error when try to save without alt', function(done) {
                    variant.alt = '';
                    return variant.save(function(err) {
                        should.exist(err);
                        done();
                    });
                });

                after(function(done) {
                    variant.remove();
                    done();
                });
            });
        });


        describe('Search Variant' , function(){
            describe('Model Variant:', function() {
                before(function(done) {
                    variant = new Variant({
                        type: 'variant@test',
                        start: '01020',
                        end: '01040',
                        ref: 'X3D3R',
                        alt: 'XXCC'
                    });

                    variant1 = new Variant({
                        type: 'variant@test',
                        start: '01020',
                        end: '01040',
                        ref: 'X3D3R',
                        alt: 'XXCC'
                    });

                    variant.save(done);
                    variant1.save(done);
                    done();
                });

                describe('Search a specific Variant' , function(){
                    it('should search variant with specific type' , function(done){
                        Variant.find({ type: 'variant@test' }, function(err, variants) {
                            variants.should.have.length > 0;
                            done();
                        });
                    });

                    it('should search variant with specific start' , function(done){
                        Variant.find({ start: '01020' }, function(err, variants) {
                            variants.should.have.length > 0;
                            done();
                        });
                    });

                    it('should search variant with specific end' , function(done){
                        Variant.find({ end: '01040' }, function(err, variants) {
                            variants.should.have.length > 0;
                            done();
                        });
                    });

                    it('should search variant with specific ref' , function(done){
                        Variant.find({ ref: 'X3D3R' }, function(err, variants) {
                            variants.should.have.length > 0;
                            done();
                        });
                    });

                    it('should search variant with specific alt' , function(done){
                        Variant.find({ alt: 'XXCC' }, function(err, variants) {
                            variants.should.have.length > 0;
                            done();
                        });
                    });
                });

after(function(done) {
    variant.remove();
    done();
});
});
}.
describe('Remove Variant' , function(){
    describe('Model Variant:', function() {
        before(function(done) {
            variant = new Variant({
                type: 'variant@test',
                start: '01020',
                end: '01040',
                ref: 'X3D3R',
                alt: 'XXCC'
            });

            variant1 = new Variant({
                type: 'variant@test',
                start: '01020',
                end: '01040',
                ref: 'X3D3R',
                alt: 'XXCC'
            });

            variant.save(done);
            variant1.save(done);
            done();
        });
    });

    describe('Remove specific Variant' , function(){
        it('should fail to remove variant with specific type' , function(done){
            Variant.remove({type: 'variant222@test'} , function(err){
                variant.should.exist(err);
            })
        });

        it('should remove variant with specific type' , function(done){
            Variant.remove({type: 'variant@test'} , function(err){
                variant.should.not.exist(err);
            })
        });

        it('should remove variant with specific start' , function(done){
            Variant.remove({start: '01020'} , function(err){
                variant.should.not.exist(err);
            })
        });

        it('should remove variant with specific end' , function(done){
            Variant.remove({end: '01040'} , function(err){
                variant.should.not.exist(err);
            })
        });

        it('should remove variant with specific ref' , function(done){
            Variant.remove({ref: 'X3D3R'} , function(err){
                variant.should.not.exist(err);
            });
        });

        it('should remove variant with specific alt' , function(done){
            Variant.remove({alt: 'XXCC'} , function(err){
                variant.should.not.exist(err);
            });
        });
    });
});


//COMPLETE THIS PART
describe('Modified Variant' , function(){
    describe('Model Variant:', function() {
        before(function(done) {
            variant = new Variant({
                type: 'variant@test',
                start: '01020',
                end: '01040',
                ref: 'X3D3R',
                alt: 'XXCC'
            });

            variant1 = new Variant({
                type: 'variant@test',
                start: '01020',
                end: '01040',
                ref: 'X3D3R',
                alt: 'XXCC'
            });

            variant.save(done);
            variant1.save(done);
            done();
        });
    });

    describe('Modified specific variant' , function(){
        it('should fail to modified variant with specific type' , function(done){
            Variant.findAndUpdate({ type: 'variant999@test', { $set: { start: '114011' }}, function(err, variant) {
                should.exist(err);
            });
        });
        
        it('should modified variant attribute with specific type' , function(done){
            Variant.findAndUpdate({ type: 'variant@test', { $set: { start: '114011' }}, function(err, variant) {
                should.not.exist(err);
            });

            Variant.find({ start: '114011' }, function(err, variants) {
                variants.should.have.length > 0;
                done();
            });      
        });
    });
});


//TODO: Add relationships test







