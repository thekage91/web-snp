'use strict';

// User routes use dbsnps controller
var express = require('express'); 
 var mers = require('mers');
 
 module.exports = function(app, passport) { 
    app.use('/api', mers({uri:'mongodb://localhost/rest_example_prod'}).rest());
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
  