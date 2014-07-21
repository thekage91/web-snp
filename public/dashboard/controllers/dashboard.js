'use strict';



angular.module('mean.dashboard', [])

        .controller('UploaderCtrl', ['$scope' , '$window' ,
        function($scope, $window) {
              
              //output e' gia' il json uscito puoi dalla funzione parse
              var parsedJson = $window.output; 

              // Filtrare tutto, e creare i vari array variants , patient , sequencing ecc ecc
              // metterli nello scope.. esempio $scope.variants ecc la tabella di crea da sola
              
              var filteredJson = $scope.filtJson;
              $scope.variants = filteredJson.variants;
              $scope.esps = filteredJson.esps;
              $scope.dbsnps= filteredJson.dbsnps;
              $scope.pathogenicities = filteredJson.pathogenicities;
              $scope.variantDetails = filteredJson.details;
              $scope.genes = filteredJson.genes;
              $scope.patient = filteredJson.patient;
              
              $scope.Table2Json = function() {

                function parseTable(table){
                  var result = {};
                  for(var i = 1; table.rows; i++){
                   result[table.rows[i].cells[0].innerText] = table.rows[i].cells[1].innerText;
                  }
                  result_json = JSON.stringify(result);
                }

                var tableVariant = angular.element('.variant');
                var tableDbsnp = angular.element('.dbsnp');
                var tablePatient = angular.element('.patient');
                var tableEsp = angular.element('.esp');
                var tableGene = angular.element('.gene');
                var tablePatho = angular.element('.pathogenicity');
                var tableSeque = angular.element('.sequencing');

                var jsonVariant = parseTable(tableVariant);
                var jsonDBsnp = parseTable(tableDbsnp);
                var jsonPatient = parseTable(tablePatient);
                var jsonEsp = parseTable(tableEsp);
                var jsonGene = parseTable(tableGene);
                var jsonPatho = parseTable(tablePatho);
                var jsonSeque = parseTable(tableSeque);

                // salvare sul DB richiamando la funzione di ugo
              }

              $scope.saveResult = function(){
                $scope.jsonUpload = $window.output;
              
              };
        }])

       
.controller('AuthorizerUserCtrl' , ['$scope' ,'$http' , function($scope , $http){

    $scope.formData = {};

    $http.get('/api/user')
        .success(function(data){
            $scope.users = data.payload;
            console.log("[DEBUG] Retrive this users " + $scope.users);
        })
        .error(function(data){
            console.log("[ERROR] Failed retrieve all users");
        });

       
    $scope.authorizeUser = function(user){
        console.log(user);

        $scope.usernameError = null;
        $scope.registerError = null;

        $http.post('/register', user)
        .success(function(data) {
            // authentication OK
            $scope.users.push(user);
            $scope.registerError = 0;
        })
        .error(function(error) {
            // Error: authentication failed
            if (error === 'Username already taken') {
                $scope.usernameError = error;
            } else {
                $scope.registerError = error;
            }
        });
    };


    $scope.cancelUser = function(user){
        console.log(user._id)
        $http.delete('/api/user/' + user._id)
            .success(function(data){
                var index = $scope.users.indexOf(user);
                $scope.users.splice(index , 1);
                console.log("[DEBUG] Remove this users " + user._id);
            })
            .error(function(data){
                console.log("[ERROR] Failed to update  user:" + user._id);
            });    
        };
}])

.controller('FamilyCtrl' , ['$scope', '$http', function($scope , $http){
    
    //$scope.inPatients = [{name: "provaIN1"} , {name: "provaIN2"} , {name: "provaIN3"}]
    //$scope.outPatients = [{name: "provaOUT1"} , {name: "provaOUT2"} , {name: "provaOUT3"}]

    $http.get('/api/family')
        .success(function(data){
            $scope.families = data.payload;
            console.log("[DEBUG] Retrive this families " + data);
        })
        .error(function(data){
            console.log("[ERROR] Failed retrieve all users");
        });

    $scope.createFamily = function(family){

        $http.post('/api/family' , family)
            .success(function(data){
                $scope.formData = {};
                $scope.families.push(data.payload);
                $scope.family = {};
                angular.element('#formInsert').collapse('hide');
                console.log("[SUCCESS] Write this data on DB: " + data)
            })
            .error(function(data) {
                console.log("[ERROR] Failed save family: " + data);
            });      
    }
    
    $scope.removeFamily = function(item){      
        var idSelected = $scope.families.indexOf(item);
        console.log("[DEBUG] I should remove family with id " + item._id);

        $http.delete('/api/family/' + item._id)
            .success(function(data){
                $scope.formData = {};
                $scope.families.splice(idSelected , 1);
                console.log("[SUCCESS] Remove family with id " + item._id);
            })
            .error(function(data) {
                console.log('[ERROR] Failed remove family: ' + data);
            });
    }

    $scope.cancel = function(){
        $scope.family = {};
        angular.element('#formInsert').collapse('hide');
    }

    $scope.show = false;
    $scope.showConfirmation = function(setShow){
        return $scope.show = setShow;
    }

    $scope.updateFamily = function(item , familyUp){
        $scope.showConfirmation(false);
        var idSelected = $scope.families.indexOf(item);

        $http.post('/api/family/' + item._id , familyUp)
            .success(function(data){
                $scope.family_edit = {};
                console.log(JSON.stringify(familyUp));
                //$scope.families[idSelected].name = familyUp;
                console.log('[SUCCESS] Update name of family with id ' + item._id);
            })
            .error(function(data){
                console.log('[ERROR] Failed update family with id ' + item._id);
            });
    }

    $scope.contains = function(array , item){
        if(array === undefined ){
            return false;
        }

        return array.indexOf(item) > -1;
    }

    $scope.showPatients = function(family){
        
        if(family.patients === undefined){
            family.patients = [];
        }

        $scope.inPatients = family.patients;
        $scope.familySelected = family;

        $http.get('/api/patient')
            .success(function(data){
                var allPatients = data.payload;
                console.log(allPatients);
                $scope.outPatients = allPatients.filter(function(item){
                    return !$scope.contains($scope.inPatients , item);
                });
            })
            .error(function(err){
                console.log("[ERROR] Failed retrieve all patients -->" + err);
            });
    }

    $scope.removePatient = function(patient){
        var idFamily = $scope.familySelected._id;
        var newPatients = $scope.inPatients;

        newPatients.splice(newPatients.indexOf(patient) , 1);
        var jsonToSend = {'patients': newPatients};
        
        $http.post('/api/family/' + idFamily , jsonToSend)
            .success(function(data){
                $scope.inPatients = newPatients;
                $scope.outPatients.push(patient);
                console.log("[SUCCESS] Remove patient " + patient._id + " from family " + idFamily);
            })
            .error(function(err){
                console.log("[ERROR] Failed remove patient " + patient._id + " from family " + idFamily);
            });
        }

    $scope.addPatient = function(patient){
        var idFamily = $scope.familySelected._id;
        var newPatients = $scope.inPatients;

        newPatients.push(patient._id);

        var jsonToSend = {'patients': newPatients};
        console.log('JSON to send' + jsonToSend);

        $http.post('/api/family/' + idFamily , jsonToSend)
            .success(function(data){
                $scope.inPatients = newPatients;
                $scope.outPatients.splice($scope.outPatients.indexOf(patient) , 1);
                console.log("[SUCCESS] Add patient " + patient._id + " in family " + idFamily);
            })
            .error(function(err){
                console.log("[ERROR] Failed add patient " + patient._id + " in family " + idFamily);
            });
    }
  
    $scope.showEdit = false;
    $scope.showEditFamilies = function(showEditFamily){
        return $scope.showEdit = showEditFamily;
    }    

    $scope.finishedOperation = function(){
        angular.element('#btn_edit').disabled = true;
        angular.element('#patientsPanel').collapse('hide');
    }  

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
                  
                     $http.get('/api/patient/finder/query?name=' + patient)
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

