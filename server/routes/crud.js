'use strict';

var express = require('express'); 
var mers = require('mers');
var mongoose = require('mongoose');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.camelize = function() {

    return this.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

module.exports = function(app, passport) { 
     var rest =mers({uri:'mongodb://localhost/mean-dev'});
      
     app.get('/api/model/:id', function (req, res, next) {
         var model = mongoose.model(req.params.id);
         if(typeof model === 'undefined') {
             model = mongoose.model(req.params.id.capitalize());
         }

        res.json(model.attr);
});
    app.get('/api/id/:kill', function (req, res, next) {
        res.json(mongoose.Types.ObjectId());
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
  