'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    DbSNP = mongoose.model('DbSNP');

/**
 * Create dbSNP
 */
exports.create = function(req, res, next) {
    var dbsnp = new DbSNP(req.body);

   
  
    req.assert('dbSNP','you must enter a valid dbSNP ').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5

    dbsnp.save(function(err) {
        if (err) {
            
                    res.status(400).send('Please fill all the required fields');
            

            return res.status(400);
        }
        res.status(200);
        res.json({ message: 'dbSNP created!' });
    });
};

/**
 * Find dbsnp by id
 */
exports.dbSNP = function(req, res, next) {
    DbSNP
        .findOne({
            dbSNP: req.params.id
        },function(err, element) {
            if (err) return next(err);
            if (!element) return next(new Error('Failed to load dbSNP with key  ' + req.params.id));
            res.json(element);
             });
};

exports.getAll = function(req, res) {
		DbSNP.find(function(err, dbsnps) {
			if (err)
				res.send(err);

			res.json(dbsnps);
		});
	};
        
        
exports.updateOne = function(req, res, next) {

		// use our bear model to find the bear we want
		DbSNP.findOne({dbSNP: req.params.id}, function(err, dbsnp) {

			if (err)
				return next(err);
                
                        for (var key in req.body) {
                        if (req.body.hasOwnProperty(key) ) {
                            if(!(dbsnp.hasOwnProperty(key)))
                                return next(new Error('dbSNP does not have '+key+' field!'));
                                    
                                dbsnp[key] = req.body[key];
                              }
                         }
			// save the dbsnp
			dbsnp.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'dbsnp updated!' });
			});

		});
	};
        
        
 exports.deleteOne = function(req, res) {
		DbSNP.remove({
			dbSNP: req.params.id
		}, function(err, elem) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	};