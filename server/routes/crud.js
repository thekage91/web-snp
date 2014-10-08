//'use strict';

var express = require('express');
var mers = require('mers');
var mongoose = require('mongoose');

module.exports = function (app, passport) {
    var rest = mers({uri: 'mongodb://localhost/mean-dev'});

    app.get('/api/model/:id', function (req, res, next) {
        var model = mongoose.model(req.params.id);
        if (typeof model === 'undefined') {
            model = mongoose.model(req.params.id.capitalize());
        }

        res.json(model.attr);
    });

    app.post('/api/array/:id', function (req, res, next) {
        var id = req.params.id;
        //console.log(JSON.stringify(req.body));
        var field = req.body.field;
        var idToAdd = req.body.id;
        var model = req.body.model;

        var isAccumulatingIDs = false;
        if(model == 'Upload') isAccumulatingIDs = true;

        mongoose.model(model).findById(id, function (err, element) {
            if (err) {
                console.log("error " + err);
                return res.status(400).send('Cant find ' + model + ' element with ID: ' + idToAdd)
            }
            if (!element) {
                console.error("/api/array cant find id: " + req.params.id);
                return res.status(400).send('Cant find '+model+' element with ID: '+ idToAdd)
            }
            //Dealing with Upload means modifying ids
            if(isAccumulatingIDs) element = element.ids;

                    if (element[field] instanceof Array)
                        element[field].push(idToAdd);
                    else
                        element[field] = idToAdd;

            element.save(function (err) {
                if (err) console.error("Error while saving ID!" + err);
            });
            return res.status(200).send('element.save() called. Model = ' + model + '; field = ' + field + '; idToAdd = ' + idToAdd);

        });
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
  