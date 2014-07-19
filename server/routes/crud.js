'use strict';

var express = require('express'); 
var mers = require('mers');
var mongoose = require('mongoose');

module.exports = function(app, passport) { 
     var rest =mers({uri:'mongodb://localhost/mean-dev'});
      
     app.get('/api/model/:id', function (req, res, next) {
        res.json(mongoose.model(req.params.id).attr);   
});
     app.use('/api', rest.rest());
 };
    
/*
module.exports = function(app, passport) {  
    var router = express.Router();
    // Setting up the dbsnps api
    router.get('/dbSNPs',dbsnps.getAll) 
          .post('/dbSNPs',dbsnps.create);
    
      
    
    router.get('/dbSNPs/:id',dbsnps.dbSNP)
          .put('/dbSNPs/:id',dbsnps.updateOne)
          .delete('/dbSNPs/:id',dbsnps.deleteOne);
       

       
    app.use('/api', router);
    // AngularJS route to check for authentication
    app.route('/loggedin')
        .get(function(req, res) {
            res.send(req.isAuthenticated() ? req.user : '0');
        });*/
  