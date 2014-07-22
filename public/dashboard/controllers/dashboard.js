'use strict';


angular.module('mean.dashboard', [])

    .controller('UploaderCtrl', ['$scope', '$window', '$http', 'Model','Parse','Save','$q','$timeout',
        function ($scope, $window, $http,Model,Parse,Save,$q,$timeout) {

            function saveInDBparsedData(result) {
                return $http.post('/api/variant',result['variants'][0]);
            }

            var parse1 = function () {
                for (var i = 0; i < arguments.length; i++) {
                    var jsonWithSchema = arguments[i][0];

                    //Get first response's filed with mongoose.Model.attr JSON
                    for (var key in jsonWithSchema) if (jsonWithSchema.hasOwnProperty(key))  break;
                    var element = key;
                    var schema = jsonWithSchema[key];

                    //console.info('[INFO] element : ' + element + '\n[INFO] schema : ' + JSON.stringify(schema));

                    schemaContainter[element] = schema;
                }
                //THIS IS THE RESULT AFTER PARSING, BEFORE SAVING
                var result = parseFromSchemas($scope.jsonUpload, schemaContainter);
//                    console.log("FINALE RESULT: ");
//                    console.log(result);
//                    //NOW SAVE IN DB
                saveInDBparsedData(result).done( function() {console.log("All Saved in DB!")})
                    .error( function (err) {console.err("[ERROR] while saving in DB: " + err)});

                //postElementArray('Variant', result['variants']);
            };



            $scope.saveResult = function () {
                $scope.jsonUpload = JSON.parse($window.output);

                var parseFunction = (Parse.createModelClassesFromData);
                //DATA OBTAINED FROM PARSING
                var parseResult = parseFunction($scope.jsonUpload,'PAZIENTE1');

                parseResult.then( function(data) {

                    console.log(data);
                    var saveFunction = (Save.saveParsedData);
                    console.log("EEHIEIHEIHEHI");

                    //To ensure all ASYNC functions are fulfilled
                    $timeout(function() {
                        saveFunction(data);
                    }, 3000).then(function () {  console.log("Data correctly save in DB!");
                    });



                },function (error) {
                    console.error("ERROR WHILE PARSING DATA: " + error)});


            };

            //angular.bootstrap(document, ['myApp']);
        }
    ])


    .controller('AuthorizerUserCtrl', ['$scope', '$http',
        function ($scope, $http) {

            $scope.formData = {};

            /* Quando LA pagina viene caricata, tutti gli utenti vengono mostrati
             Questo viene realizzato attraverso una chiamata http all'api definita
             in /server/route/users.js
             Che restitusice un json con tutti gli utenti
             */

            $http.get('/api/user')
                .success(function (data) {
                    $scope.users = data;
                    console.logfromCallback("[DEBUG] Retrive this users " + data);
                })
                .error(function (data) {
                    console.log("[ERROR] Failed retrieve all users");
                });

            $scope.authorizeUser = function () {
                $http.put('/api/user', $scope.formData)
                    .success(function (data) {
                        $scope.users = data;
                        console.log("[DEBUG] Retrive this users " + data);
                    })
                    .error(function (data) {
                        console.log("[ERROR] Failed to update user:" + data);
                    });
            };

            $scope.dismissUser = function () {
                $http.put('/api/user', $scope.formData)
                    .success(function (data) {
                        $scope.users = data;
                        console.log("[DEBUG] Retrive this users " + data);
                    })
                    .error(function (data) {
                        console.log("[ERROR] Failed to update  user:" + data);
                    });
            };
        }
    ])

    .controller('FamilyCtrl', ['$scope', '$http',
        function ($scope, $http) {

            //$scope.inPatients = [{name: "provaIN1"} , {name: "provaIN2"} , {name: "provaIN3"}]
            //$scope.outPatients = [{name: "provaOUT1"} , {name: "provaOUT2"} , {name: "provaOUT3"}]

            $http.get('/api/family')
                .success(function (data) {
                    $scope.families = data.payload;
                    console.log("[DEBUG] Retrive this families " + data);
                })
                .error(function (data) {
                    console.log("[ERROR] Failed retrieve all users");
                });

            $scope.createFamily = function (family) {

                $http.post('/api/family', family)
                    .success(function (data) {
                        $scope.formData = {};
                        $scope.families.push(data.payload);
                        $scope.family = {};
                        angular.element('#formInsert').collapse('hide');
                        console.log("[SUCCESS] Write this data on DB: " + data)
                    })
                    .error(function (data) {
                        console.log("[ERROR] Failed save family: " + data);
                    });
            }

            $scope.removeFamily = function (item) {
                var idSelected = $scope.families.indexOf(item);
                console.log("[DEBUG] I should remove family with id " + item._id);

                $http.delete('/api/family/' + item._id)
                    .success(function (data) {
                        $scope.formData = {};
                        $scope.families.splice(idSelected, 1);
                        console.log("[SUCCESS] Remove family with id " + item._id);
                    })
                    .error(function (data) {
                        console.log('[ERROR] Failed remove family: ' + data);
                    });
            }

            $scope.cancel = function () {
                $scope.family = {};
                angular.element('#formInsert').collapse('hide');
            }

            $scope.show = false;
            $scope.showConfirmation = function (setShow) {
                return $scope.show = setShow;
            }

            $scope.updateFamily = function (item, familyUp) {
                $scope.showConfirmation(false);
                var idSelected = $scope.families.indexOf(item);

                $http.post('/api/family/' + item._id, familyUp)
                    .success(function (data) {
                        $scope.family_edit = {};
                        console.log(JSON.stringify(familyUp));
                        //$scope.families[idSelected].name = familyUp;
                        console.log('[SUCCESS] Update name of family with id ' + item._id);
                    })
                    .error(function (data) {
                        console.log('[ERROR] Failed update family with id ' + item._id);
                    });
            }

            $scope.contains = function (array, item) {
                if (array === undefined) {
                    return false;
                }

                return array.indexOf(item) > -1;
            }

            $scope.showPatients = function (family) {

                if (family.patients === undefined) {
                    family.patients = [];
                }

                $scope.inPatients = family.patients;
                $scope.familySelected = family;

                $http.get('/api/patient')
                    .success(function (data) {
                        var allPatients = data.payload;
                        console.log(allPatients);
                        $scope.outPatients = allPatients.filter(function (item) {
                            return !$scope.contains($scope.inPatients, item);
                        });
                    })
                    .error(function (err) {
                        console.log("[ERROR] Failed retrieve all patients -->" + err);
                    });
            }

            $scope.removePatient = function (patient) {
                var idFamily = $scope.familySelected._id;
                var newPatients = $scope.inPatients;

                newPatients.splice(newPatients.indexOf(patient), 1);
                var jsonToSend = {
                    'patients': newPatients
                };

                $http.post('/api/family/' + idFamily, jsonToSend)
                    .success(function (data) {
                        $scope.inPatients = newPatients;
                        $scope.outPatients.push(patient);
                        console.log("[SUCCESS] Remove patient " + patient._id + " from family " + idFamily);
                    })
                    .error(function (err) {
                        console.log("[ERROR] Failed remove patient " + patient._id + " from family " + idFamily);
                    });
            }

            $scope.addPatient = function (patient) {
                var idFamily = $scope.familySelected._id;
                var newPatients = $scope.inPatients;

                newPatients.push(patient._id);

                var jsonToSend = {
                    'patients': newPatients
                };
                console.log('JSON to send' + jsonToSend);

                $http.post('/api/family/' + idFamily, jsonToSend)
                    .success(function (data) {
                        $scope.inPatients = newPatients;
                        $scope.outPatients.splice($scope.outPatients.indexOf(patient), 1);
                        console.log("[SUCCESS] Add patient " + patient._id + " in family " + idFamily);
                    })
                    .error(function (err) {
                        console.log("[ERROR] Failed add patient " + patient._id + " in family " + idFamily);
                    });
            }

            $scope.showEdit = false;
            $scope.showEditFamilies = function (showEditFamily) {
                return $scope.showEdit = showEditFamily;
            }

            $scope.finishedOperation = function () {
                angular.element('#btn_edit').disabled = true;
                angular.element('#patientsPanel').collapse('hide');
            }

        }
    ])


    .controller('ExecuteQueryCtrl', ['$scope', '$http',
        function ($scope, $http) {
            var element;

            var successInitialQuery = function (data) {
                $scope.elements = new Array();
                console.log("QUERY SUCCEDED. RECEIVED:" + JSON.stringify(data));

                data.payload.forEach(function (payload) {
                    if (payload.variants) payload.variants.forEach(function (variant) {

                        $http.get('/api/variant/' + variant)
                            .success(function (data) {
                                console.log('Got variant');
                                $scope.elements.push(data.payload);
                            })
                            .error(function () {
                                console.log('[ERROR] Failed retrieving variant  ith ID: ' + variant);
                            });
                    });
                    else
                        $http.get('/api/variant/' + payload.variant)
                            .success(function (data) {
                                console.log('Got variant');
                                $scope.elements.push(data.payload);
                            })
                            .error(function () {
                                console.log('[ERROR] Failed retrieving variant  ith ID: ' + variant);
                            });
                });
            };

            $scope.elValue = function (x) {
                element = x;
            };

            $scope.submitBase = function () {
                var keyword = $scope.query.keyword;

                switch (element) {

                    case 'gene':
                    case 'region':
                    case 'mutation':

                        $http.get('/api/gene/finder/query?' + element + '=' + keyword)
                            .success(successInitialQuery)
                            .error(function (data) {
                                console.log('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                            });
                        break;

                    case 'patient':
                        $http.get('/api/patient/' + keyword)
                            .success(successInitialQuery)
                            .error(function (data) {
                                console.log('[ERROR] Failed retrieving gene with gene field: ' + keyword);
                            });
                        break;

                    case 'genotype':
                        $http.get('/api/variantdetail/finder/query?' + element + '=' + keyword)
                            .success(successInitialQuery)
                            .error(function (data) {
                                console.log('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                            });
                        break;
                    case 'freqAlt':
                    case 'dbsnp':
                        $http.get('/api/dbsnp/finder/query?' + element + '=' + keyword)
                            .success(successInitialQuery)
                            .error(function (data) {
                                console.log('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                            });
                        break;
                }
            };

            $scope.submitByEsp = function () {
                $http.get('/api/esp/finder/query?ESP6500_ALL=' +
                    $scope.ESP6500_ALL + '&ESP6500_AA=' +
                    $scope.ESP6500_AA + '&ESP6500_EA=' + $scope.ESP6500_EA)
                    .success(successInitialQuery)
                    .error(function (data) {
                        console.log('[ERROR] Failed retrieving ESP with thath field: ');
                    });
            };

            $scope.submitByRegion = function () {
                $http.get('/api/variant/finder/query?chr=' +
                    $scope.chr + '&start=' +
                    $scope.start + '&end=' + $scope.end)
                    .success(function (data) {
                        console.log('Got variant: ' + JSON.stringify(data));
                        $scope.elements = new Array();
                        $scope.elements = data.payload;
                        console.log('dovrei : ' + JSON.stringify($scope.elements));
                    })
                    .error(function (data) {
                        console.log('[ERROR] Failed retrieving variant with thath field: ');
                    });
            };

            var getVariantFromDetail = function (variant) {

                $http.get('/api/variant/' + variant)
                    .success(function (data) {
                        data.payload.patients.forEach(getPatientFromVariant);
                    })
                    .error(function (data) {
                        console.log('[ERROR] Failed retrieving Variant: ' + variant);
                    });
            }

            var getPatientFromVariant = function (patient) {

                $http.get('/api/patient/finder/query?name=' + patient)
                    .success(function (data) {
                        $scope.patients.push(data.payload);
                        console.log('Pushed ' + JSON.stringify(data) + ' in scope.patients');
                    })
                    .error(function (data) {
                        console.log('[ERROR] Failed retrieving patient: ' + patient);
                    });
            }

            $scope.submitByGenotype = function () {
                $http.get('/api/variantdetail/finder/query?genotype=' +
                    $scope.genotype)

                    .success(function (data) {
                        $scope.patients = new Array();
                        data.payload.forEach(function (element) {
                            console.log("ELEMENT = " + JSON.stringify(element));
                            getVariantFromDetail(element.variant);
                        });
                    })
                    .error(function (data) {
                        console.log('[ERROR] Failed retrieving VariantDetail with genotype: ' + $scope.genotype);
                    });

            };


            $scope.clear = function () {
                console.log("CLEAR CALLED");
                $scope.elements = {};
                console.log("ORA ELEMENTI:" + JSON.stringify($scope.elements));
            }


        }




    ]);