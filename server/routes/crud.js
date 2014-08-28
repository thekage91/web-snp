//'use strict';

var express = require('express');
var mers = require('mers');
var mongoose = require('mongoose');
var Upload = mongoose.model('Upload');

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.camelize = function () {

    return this.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

module.exports = function (app, passport) {
    var rest = mers({uri: 'mongodb://localhost/mean-dev'});

    app.get('/api/model/:id', function (req, res, next) {
        var model = mongoose.model(req.params.id);
        if (typeof model === 'undefined') {
            model = mongoose.model(req.params.id.capitalize());
        }

        res.json(model.attr);
    });
    app.get('/api/id/:kill', function (req, res, next) {
        res.json(mongoose.Types.ObjectId());
    });

    app.post('/api/array/:id', function (req, res, next) {
        var id = req.params.id;
        console.log(JSON.stringify(req.body));
        var field = req.body.field;
        var idToAdd = req.body.id;
        var model = req.body.model;

        mongoose.model(model).findById(id, function (err, element) {
            if (err)
                console.log("error " + err);
            if (!element) {
                console.error("/api/array cant find id: " + req.params.id);
                return res.status(400).send('Cant find '+model+' element with ID: '+ idToAdd)
            }
                    if (element[field] instanceof Array)
                        element[field].push(idToAdd);
                    else
                        element[field] = idToAdd;

            element.save(function (err) {
                if (err) console.error("Error while saving ID!" + err);
            });
            return res.status(200).send('Id added. all ok');

        });
    });

    app.post('/api/idAcc/:patient', function (req, res, next) {
        Upload.findOne({ patientName: req.params.patient}, function (err, doc) {
            // doc may be null if no document matched
            // doc is a Document
            var el = req.body.modelClass;
            var id = req.body.id;
            if (err)
                return res.status(400).send(err);
            if (!doc)
                return res.status(412).send('IDs from patients ' + req.params.patient + 'Not found');

            console.log(JSON.stringify(req.body));
            doc.ids[req.body.modelClass].push(req.body.id);
            doc.save(function (err) {
                if (err) console.error("Error while saving ID!" + err)
            });

            return res.status(200).send(req.body.modelClass + ' of ' + req.params.patient + ' succesfully updated with ID: ' + req.body.id);
        });
        //return res.status(400).send('Request not recognized');

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
  