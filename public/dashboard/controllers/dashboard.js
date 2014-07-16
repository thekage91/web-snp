'use strict';



angular.module('mean.dashboard', [])

.controller('UploaderCtrl' , [ '$scope', '$upload', function($scope, $upload) {
  $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for ( var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if (window.FileReader && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };

    $scope.start = function(index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url : 'upload',
                method: $scope.httpMethod,
                headers: {'my-header': 'my-header-value'},
                data : {
                    myModel : $scope.myModel
                },
                /* formDataAppender: function(fd, key, val) {
                    if (angular.isArray(val)) {
                        angular.forEach(val, function(v) {
                          fd.append(key, v);
                        });
                      } else {
                        fd.append(key, val);
                      }
                }, */
                /* transformRequest: [function(val, h) {
                    console.log(val, h('my-header')); return val + '-modified';
                }], */
                file: $scope.selectedFiles[index],
                fileFormDataName: 'myFile'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                // Math.min is to fix IE which reports 200% sometimes
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });

            $scope.upload[index].xhr(function(xhr){

            });
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: 'upload',
                    headers: {'Content-Type': $scope.selectedFiles[index].type},
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.abort = function(index) {
        $scope.upload[index].abort(); 
        $scope.upload[index] = null;
    };


}])

.controller('AuthorizerUserCtrl' , ['$scope' ,'$http' , function($scope , $http){

    $scope.formData = {};

    /* Quando LA pagina viene caricata, tutti gli utenti vengono mostrati
        Questo viene realizzato attraverso una chiamata http all'api definita
        in /server/route/users.js
        Che restitusice un json con tutti gli utenti
    */
    
    $http.get('/api/users')
        .success(function(data){
            $scope.users = data;
            console.log("[DEBUG] Retrive this users " + data);
        })
        .error(function(data){
            console.log("[ERROR] Failed retrieve all users");
        });

    $scope.authorizeUser = function(){
       $http.put('/api/users' , $scope.formData)
            .success(function(data){
                $scope.users = data;
                console.log("[DEBUG] Retrive this users " + data);
            })
            .error(function(data){
                console.log("[ERROR] Failed to update user:" + data);
            });
        };

    $scope.dismissUser = function(){
        $http.put('/api/users' , $scope.formData)
            .success(function(data){
                $scope.users = data;
                console.log("[DEBUG] Retrive this users " + data);
            })
            .error(function(data){
                console.log("[ERROR] Failed to update  user:" + data);
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

    $scope.updateFamily = function(item , familyUp){
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
        var jsonToSend = {'patiens': newPatients};

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

        newPatients.push(patient);

        var jsonToSend = {'patiens': newPatients};

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

    $scope.finishedOperation = function(){
        angular.element('#patientsPanel').collapse('hide');
        angular.element('#edit').style.display = 'block';
        angular.element('#ok').style.display = 'none';

    }   
}])

.controller('ExecuteQueryCtrl' , ['$scope' , '$http' , function($scope , $http){
    
}]);



