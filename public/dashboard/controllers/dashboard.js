'use strict';



angular.module('mean.dashboard', [])

        .controller('UploaderCtrl', ['$scope', function($scope) {
              


        }])

        .controller('AuthorizerUserCtrl', ['$scope', '$http', function($scope, $http) {

                $scope.formData = {};

                /* Quando LA pagina viene caricata, tutti gli utenti vengono mostrati
                 Questo viene realizzato attraverso una chiamata http all'api definita
                 in /server/route/users.js
                 Che restitusice un json con tutti gli utenti
                 */

                $http.get('/api/users')
                        .success(function(data) {
                            $scope.users = data;
                            console.log("[DEBUG] Retrive this users " + data);
                        })
                        .error(function(data) {
                            console.log("[ERROR] Failed retrieve all users");
                        });

                $scope.authorizeUser = function() {
                    $http.put('/api/users', $scope.formData)
                            .success(function(data) {
                                $scope.users = data;
                                console.log("[DEBUG] Retrive this users " + data);
                            })
                            .error(function(data) {
                                console.log("[ERROR] Failed to update user:" + data);
                            });
                };

                $scope.dismissUser = function() {
                    $http.put('/api/users', $scope.formData)
                            .success(function(data) {
                                $scope.users = data;
                                console.log("[DEBUG] Retrive this users " + data);
                            })
                            .error(function(data) {
                                console.log("[ERROR] Failed to update  user:" + data);
                            });
                };
            }])

        .controller('FamilyCtrl', ['$scope', '$http', function($scope, $http) {

                $scope.createFamily = function() {
                    $http.post('/api/family', $scope.formData)
                            .success(function(data) {
                                $scope.formData = {};
                                $scope.family = data;
                            })
                            .error(function(data) {
                                console.log('[ERROR] Failed save family: ' + data);
                            });
                };

                $scope.removeFamily = function() {
                    $http.post('/api/family', $scope.formData)
                            .success(function(data) {
                                $scope.formData = {};
                                $scope.family = data;
                            })
                            .error(function(data) {
                                console.log('[ERROR] Failed save family: ' + data);
                            });
                };

            }])

        .controller('ExecuteQueryCtrl', ['$scope', '$http', function($scope, $http) {
                var element;

                var successInitialQuery = function(data) {
                    $scope.elements = new Array();
                    console.log("QUERY SUCCEDED. RECEIVED:" + JSON.stringify(data));
                    
                    data.payload.forEach( function (payload) { 
                        if(payload.variants) payload.variants.forEach(function(variant) {
                            
                            $http.get('/api/variant/' + variant)
                                .success(function(data) {
                                    console.log('Got variant');
                                    $scope.elements.push(data.payload);
                                })
                                .error(function() {
                                    console.log('[ERROR] Failed retrieving variant  ith ID: ' + variant);
                                });
                            });
                        else
                            $http.get('/api/variant/' + payload.variant)
                                .success(function(data) {
                                    console.log('Got variant');
                                    $scope.elements.push(data.payload);
                                })
                                .error(function() {
                                    console.log('[ERROR] Failed retrieving variant  ith ID: ' + variant);
                                });
                    });
                };
                           
                $scope.elValue = function(x) {
                    element = x;
                };

                $scope.submitBase = function() {
                    var keyword = $scope.query.keyword;

                    switch (element) {

                        case 'gene':
                        case 'region':
                        case 'mutation':

                            $http.get('/api/gene/finder/query?' + element + '=' + keyword)
                                    .success(successInitialQuery)
                                    .error(function(data) {
                                        console.log('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                                    });
                            break;

                        case 'patient':
                            $http.get('/api/patient/' + keyword)
                                    .success(successInitialQuery)
                                    .error(function(data) {
                                        console.log('[ERROR] Failed retrieving gene with gene field: ' + keyword);
                                    });
                            break;

                        case 'genotype':
                            $http.get('/api/variantdetail/finder/query?' + element + '=' + keyword)
                                    .success(successInitialQuery)
                                    .error(function(data) {
                                        console.log('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                                    });
                            break;
                        case 'freqAlt':
                        case 'dbsnp':
                            $http.get('/api/dbsnp/finder/query?' + element + '=' + keyword)
                                    .success(successInitialQuery)
                                    .error(function(data) {
                                        console.log('[ERROR] Failed retrieving gene with ' + element + ' field: ' + keyword);
                                    });
                            break;
                    }
                };
                
                $scope.submitByEsp = function() {
                    $http.get('/api/esp/finder/query?ESP6500_ALL=' +
                               $scope.ESP6500_ALL+ '&ESP6500_AA='  +  
                               $scope.ESP6500_AA + '&ESP6500_EA='  + $scope.ESP6500_EA)
                               .success(successInitialQuery)
                               .error(function(data) {
                                        console.log('[ERROR] Failed retrieving ESP with thath field: ');
                                    });
                };
                
                $scope.submitByRegion = function() {
                    $http.get('/api/variant/finder/query?chr=' +
                               $scope.chr+ '&start='  +  
                               $scope.start + '&end='  + $scope.end)
                               .success(function (data) {
                                   console.log('Got variant: '+ JSON.stringify(data));
                                   $scope.elements = new Array();
                                   $scope.elements = data.payload;
                                   console.log('dovrei : '+ JSON.stringify($scope.elements));
                            })
                               .error(function(data) {
                                        console.log('[ERROR] Failed retrieving variant with thath field: ');
                                    } );
                };
                
                var getVariantFromDetail = function (variant) {
                  
                     $http.get('/api/variant/' + variant)
                             .success(function (data) {
                                 data.payload.patients.forEach(getPatientFromVariant);
                                  })
                             .error(function(data) {
                                        console.log('[ERROR] Failed retrieving Variant: '+ variant);
                                    });          
                }
                
                 var getPatientFromVariant = function (patient) {
                  
                     $http.get('/api/patient/' + patient)
                             .success(function (data) {
                                $scope.patients.push(data.payload);
                                console.log('Pushed '+JSON.stringify(data)+' in scope.patients');
                            })
                             .error(function(data) {
                                        console.log('[ERROR] Failed retrieving patient: '+ patient);
                                    });          
                }
                
                $scope.submitByGenotype = function() {
                    $http.get('/api/variantdetail/finder/query?genotype=' +
                               $scope.genotype)
                       
                               .success(function(data) {
                                   $scope.patients = new Array();
                                   data.payload.forEach(function (element) {
                                    console.log("ELEMENT = "+JSON.stringify(element));
                                       getVariantFromDetail(element.variant);
                                       });
                                   })
                               .error(function(data) {
                                        console.log('[ERROR] Failed retrieving VariantDetail with genotype: '+$scope.genotype);
                                    });               
                                   
                               };
                
                
                $scope.clear = function() {
                    console.log("CLEAR CALLED");
                    $scope.elements = {};
                    console.log("ORA ELEMENTI:" + JSON.stringify($scope.elements));
                }
       
            
            }
            
           
        
            
            ]);

