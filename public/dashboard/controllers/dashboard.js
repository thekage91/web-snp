'use strict';



angular.module('mean.dashboard', [])

        .controller('UploaderCtrl', ['$scope', '$upload', function($scope, $upload) {
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
                    for (var i = 0; i < $files.length; i++) {
                        var $file = $files[i];
                        if (window.FileReader && $file.type.indexOf('image') > -1) {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL($files[i]);
                            var loadFile = function(fileReader, index) {
                                fileReader.onload = function(e) {
                                    $timeout(function() {
                                        $scope.dataUrls[index] = e.target.result;
                                    });
                                };
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
                            url: 'upload',
                            method: $scope.httpMethod,
                            headers: {'my-header': 'my-header-value'},
                            data: {
                                myModel: $scope.myModel
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
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function(evt) {
                            // Math.min is to fix IE which reports 200% sometimes
                            $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                        });

                        $scope.upload[index].xhr(function(xhr) {

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
                                if (response.status > 0)
                                    $scope.errorMsg = response.status + ': ' + response.data;
                            }, function(evt) {
                                // Math.min is to fix IE which reports 200% sometimes
                                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                            });
                        };
                        fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
                    }
                };

                $scope.abort = function(index) {
                    $scope.upload[index].abort();
                    $scope.upload[index] = null;
                };


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
                                  /* data.payload.forEach( function (payload) { 
                                   console.log('pushing '+ JSON.stringify(payload));
                                   $scope.elements.push(data.payload);
                                   console.log('now: '+ JSON.stringify($scope.elements));
                                });*/
                                   console.log('dovrei : '+ JSON.stringify($scope.elements));
                            })
                               .error(function(data) {
                                        console.log('[ERROR] Failed retrieving variant with thath field: ');
                                    } );
                };
            }]);

